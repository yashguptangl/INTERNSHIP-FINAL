import { google } from 'googleapis';
import prisma from '../config/database.js';

interface SheetRow {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  country?: string;
  domain: string;
  address?: string;
  college?: string;
  degree?: string;
  year?: string;
  socialMedia?: string;
}

interface SyncResult {
  synced: number;
  skipped: number;
  errors: number;
}

class GoogleSheetsService {
  private sheets: any;
  private auth: any;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      const b64 = process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64;
      if (!b64) {
        console.warn('❌ GOOGLE_SHEETS_CREDENTIALS_BASE64 missing. Sync disabled.');
        return;
      }

      const json = Buffer.from(b64, 'base64').toString('utf8');
      const credentials = JSON.parse(json);

      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('✅ Google Sheets Auth Initialized');
    } catch (error) {
      console.error('❌ Google Sheets Auth Failed:', error);
      this.sheets = null;
    }
  }

  public isConfigured(): boolean {
    return !!this.sheets && !!this.spreadsheetId;
  }

  private async getLastSyncedRow(): Promise<number> {
    try {
      const lastIntern = await prisma.intern.findFirst({
        orderBy: { googleSheetRowId: 'desc' },
        select: { googleSheetRowId: true }
      });
      return parseInt(lastIntern?.googleSheetRowId || '1');
    } catch {
      return 1;
    }
  }

  private generateEmployeeId(domain: string, phase: number): string {
    const domainCodes: Record<string, string> = {
      'MERN Stack': 'MRN', 'Java Development': 'JAV', 'Data Science': 'DTS',
      'AI/ML': 'AIM', 'Cyber Security': 'CYB', 'Data Analytics': 'DATA',
      'Python Programming': 'PYT', 'UI/UX Design': 'UIX',
    };

    const year = new Date().getFullYear().toString().slice(-2);
    const code = domainCodes[domain] || 'GEN';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TS${code}${year}P${phase}${random}`;
  }

  private calculatePhase(): number {
    const month = new Date().getMonth();
    if (month >= 0 && month <= 3) return 1;
    if (month >= 4 && month <= 7) return 2;
    return 3;
  }

  private parseSheetTimestamp(raw: string): Date | null {
    if (!raw) return null;
    const [datePart, timePart] = raw.split(' ');
    if (!datePart) return null;

    const [dd, mm, yyyy] = datePart.split('/').map(v => parseInt(v, 10));
    if (!dd || !mm || !yyyy) return null;

    let hh = 0, min = 0, ss = 0;
    if (timePart) {
      const t = timePart.split(':').map(v => parseInt(v, 10));
      hh = t[0] || 0; min = t[1] || 0; ss = t[2] || 0;
    }

    const d = new Date(yyyy, mm - 1, dd, hh, min, ss);
    return isNaN(d.getTime()) ? null : d;
  }

  private calculateDates(applicationTimestamp: string) {
    const appliedDate = this.parseSheetTimestamp(applicationTimestamp) || new Date();
    const day = appliedDate.getDate();
    const month = appliedDate.getMonth();
    const year = appliedDate.getFullYear();

    let startDate: Date;
    if (day >= 1 && day <= 10) {
      startDate = new Date(year, month, 11);
    } else if (day >= 11 && day <= 20) {
      startDate = new Date(year, month, 21);
    } else {
      startDate = new Date(year, month + 1, 1);
    }

    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    return { startDate, endDate };
  }

  private getColumnIndex(searchTerms: string[], headers: string[]): number {
    for (const term of searchTerms) {
      const index = headers.findIndex((h: string) =>
        h.toLowerCase().includes(term.toLowerCase())
      );
      if (index !== -1) return index;
    }
    return -1;
  }

  private parseSheetRow(row: any, columnMap: any): SheetRow {
    return {
      timestamp: columnMap.timestamp >= 0 ? (row[columnMap.timestamp] || '') : '',
      name: columnMap.name >= 0 ? (row[columnMap.name] || '') : '',
      email: columnMap.email >= 0 ? (row[columnMap.email] || '') : '',
      phone: columnMap.phone >= 0 ? (row[columnMap.phone] || '') : '',
      gender: columnMap.gender >= 0 ? (row[columnMap.gender] || '') : '',
      country: columnMap.country >= 0 ? (row[columnMap.country] || '') : '',
      domain: columnMap.domain >= 0 ? (row[columnMap.domain] || '') : '',
      address: columnMap.address >= 0 ? (row[columnMap.address] || '') : '',
      college: columnMap.college >= 0 ? (row[columnMap.college] || '') : '',
      degree: columnMap.degree >= 0 ? (row[columnMap.degree] || '') : '',
      year: columnMap.year >= 0 ? (row[columnMap.year] || '') : '',
      socialMedia: columnMap.socialMedia >= 0 ? (row[columnMap.socialMedia] || '') : '',
    };
  }

  private isValidRow(sheetData: SheetRow, rowNumber: number): boolean {
    const trimmedEmail = sheetData.email?.trim();
    if (!trimmedEmail) {
      console.log(`⚠️ Row ${rowNumber}: Email empty`);
      return false;
    }

    const rawTimestamp = sheetData.timestamp?.toString().trim();
    if (!rawTimestamp) {
      console.log(`⚠️ Row ${rowNumber}: Timestamp empty`);
      return false;
    }

    if (!this.parseSheetTimestamp(rawTimestamp)) {
      console.log(`⚠️ Row ${rowNumber}: Invalid timestamp`);
      return false;
    }

    if (!sheetData.domain?.trim()) {
      console.log(`⚠️ Row ${rowNumber}: Domain empty`);
      return false;
    }

    return true;
  }

  // 🚀 FIXED: Batch Processing + Timeout
  async syncFromSheets(): Promise<SyncResult> {
    try {
      if (!this.sheets || !this.spreadsheetId) {
        console.log('❌ Google Sheets not configured. Skipping.');
        return { synced: 0, skipped: 0, errors: 0 };
      }

      console.log('🚀 Starting Google Sheets sync...');

      const metadata = await this.sheets.spreadsheets.get({ 
        spreadsheetId: this.spreadsheetId 
      });
      const firstSheet = metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';
      
      const lastSyncedRow = await this.getLastSyncedRow();
      const startRow = Math.max(lastSyncedRow, 2);
      console.log(`📊 Incremental sync from row ${startRow} in "${firstSheet}"`);

      // Get headers
      const headersResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${firstSheet}!A1:Z1`,
      });
      const headers = headersResponse.data.values?.[0] || [];

      // Column mapping
      const columnMap: any = {
        timestamp: this.getColumnIndex(['timestamp', 'time', 'date'], headers),
        name: this.getColumnIndex(['name', 'full name', 'student name'], headers),
        email: this.getColumnIndex(['email', 'e-mail', 'email address'], headers),
        phone: this.getColumnIndex(['phone', 'mobile', 'contact', 'whatsapp'], headers),
        gender: this.getColumnIndex(['gender', 'sex'], headers),
        country: this.getColumnIndex(['country', 'nation'], headers),
        domain: this.getColumnIndex(['domain', 'field', 'department', 'track'], headers),
        address: this.getColumnIndex(['address', 'location'], headers),
        college: this.getColumnIndex(['college', 'university', 'institute'], headers),
        degree: this.getColumnIndex(['degree', 'course', 'program'], headers),
        year: this.getColumnIndex(['year', 'graduation year', 'passing year'], headers),
        socialMedia: this.getColumnIndex(['social', 'linkedin', 'portfolio', 'github'], headers),
      };

      console.log('🗺️ Column mapping OK');

      // Get new rows only
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${firstSheet}!A${startRow}:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        console.log('⚠️ No new data found.');
        return { synced: 0, skipped: 0, errors: 0 };
      }

      console.log(`📋 Found ${rows.length} new rows to process`);

      // Validate all rows first
      const validRows: { sheetData: SheetRow; rowNumber: number }[] = [];
      let skippedCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = startRow + i;
        const sheetData = this.parseSheetRow(row, columnMap);
        
        if (this.isValidRow(sheetData, rowNumber)) {
          validRows.push({ sheetData, rowNumber });
        } else {
          skippedCount++;
        }
      }

      console.log(`✅ ${validRows.length} valid rows ready`);

      // 🚀 BATCH PROCESSING - 5 rows per transaction (ULTRA SAFE)
      let syncedCount = 0, errorCount = 0;
      const BATCH_SIZE = 5;

      for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
        const batch = validRows.slice(i, i + BATCH_SIZE);
        console.log(`🔄 Processing batch ${Math.floor(i/BATCH_SIZE) + 1} (${batch.length} rows)`);
        
        try {
          await prisma.$transaction(async (tx) => {
            for (const { sheetData, rowNumber } of batch) {
              const trimmedEmail = sheetData.email!.trim();
              
              // Duplicate check
              const existing = await tx.intern.findUnique({ 
                where: { email: trimmedEmail } 
              });
              if (existing && existing.googleSheetRowId !== `${rowNumber}`) {
                console.log(`⚠️ Row ${rowNumber}: Duplicate email, skipping`);
                continue;
              }

              const phase = this.calculatePhase();
              const { startDate, endDate } = this.calculateDates(sheetData.timestamp);
              const parsedAppliedDate = this.parseSheetTimestamp(sheetData.timestamp)!;

              await tx.intern.upsert({
                where: { email: trimmedEmail },
                update: {
                  name: sheetData.name,
                  email: trimmedEmail,
                  phone: sheetData.phone,
                  gender: sheetData.gender,
                  country: sheetData.country,
                  domain: sheetData.domain,
                  address: sheetData.address,
                  college: sheetData.college,
                  degree: sheetData.degree,
                  year: sheetData.year,
                  socialMedia: sheetData.socialMedia,
                  appliedDate: parsedAppliedDate,
                  startDate, endDate, phase,
                },
                create: {
                  employeeId: this.generateEmployeeId(sheetData.domain, phase),
                  name: sheetData.name,
                  email: trimmedEmail,
                  phone: sheetData.phone,
                  gender: sheetData.gender,
                  country: sheetData.country,
                  domain: sheetData.domain,
                  address: sheetData.address,
                  college: sheetData.college,
                  degree: sheetData.degree,
                  year: sheetData.year,
                  socialMedia: sheetData.socialMedia,
                  appliedDate: parsedAppliedDate,
                  startDate, endDate, phase,
                  status: 'pending',
                  googleSheetRowId: `${rowNumber}`,
                },
              });

              console.log(`✅ Synced row ${rowNumber}: ${sheetData.name}`);
              syncedCount++;
            }
          }, {
            maxWait: 5000,
            timeout: 15000  // 15 seconds - SUPER SAFE
          });
          
        } catch (batchError: any) {
          errorCount += batch.length;
          console.error(`❌ Batch ${Math.floor(i/BATCH_SIZE) + 1} failed:`, batchError.message);
        }
      }

      console.log(`\n🎉 SYNC COMPLETE:`);
      console.log(`✅ Synced: ${syncedCount}`);
      console.log(`⚠️  Skipped: ${skippedCount}`);
      console.log(`❌ Errors: ${errorCount}`);
      
      return { synced: syncedCount, skipped: skippedCount, errors: errorCount };

    } catch (error: any) {
      console.error('❌ CRITICAL SYNC ERROR:', error.message);
      return { synced: 0, skipped: 0, errors: 1 };
    }
  }

  startPeriodicSync(intervalMinutes: number = 120): void {
    console.log(`⏰ Periodic sync started: every ${intervalMinutes} minutes (2 HOURS SAFE)`);
    
    // Initial sync
    this.syncFromSheets().catch(console.error);

    // Schedule periodic sync
    setInterval(() => {
      console.log('\n🔄 === SCHEDULED SYNC STARTING ===');
      this.syncFromSheets().catch(console.error);
    }, intervalMinutes * 60 * 1000);
  }
}

export default new GoogleSheetsService();
