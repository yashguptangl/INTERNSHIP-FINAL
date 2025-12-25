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

class GoogleSheetsService {
  private sheets: any;
  private auth: any;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
    this.initializeAuth();
  }

  // ✅ Base64 → JSON → GoogleAuth
  private initializeAuth() {
    try {
      const b64 = process.env.GOOGLE_SHEETS_CREDENTIALS_BASE64;

      if (!b64) {
        console.warn('❌ GOOGLE_SHEETS_CREDENTIALS_BASE64 missing. Google Sheets sync disabled.');
        return;
      }

      const json = Buffer.from(b64, 'base64').toString('utf8');
      const credentials = JSON.parse(json);

      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({
        version: 'v4',
        auth: this.auth,
      });

      console.log('✅ Google Sheets Auth Initialized');
    } catch (error) {
      console.error('❌ Google Sheets Auth Failed:', error);
      this.sheets = null;
    }
  }

  public isConfigured(): boolean {
    return !!this.sheets && !!this.spreadsheetId;
  }

  private generateEmployeeId(domain: string, phase: number): string {
    const domainCodes: Record<string, string> = {
      'MERN Stack': 'MRN',
      'Java Development': 'JAV',
      'Data Science': 'DTS',
      'AI/ML': 'AIM',
      'Cyber Security': 'CYB',
      'Data Analytics': 'DATA',
      'Python Programming': 'PYT',
      'UI/UX Design': 'UIX',
    };

    const year = new Date().getFullYear().toString().slice(-2);
    const code = domainCodes[domain] || 'GEN';
    const random = Math.floor(1000 + Math.random() * 9000);

    return `TS${code}${year}P${phase}${random}`;
  }

  private calculatePhase(): number {
    const now = new Date();
    const month = now.getMonth();

    if (month >= 0 && month <= 3) return 1;
    if (month >= 4 && month <= 7) return 2;
    return 3;
  }

  // ✅ NEW: parse "26/12/2025 00:43:27" safely
  private parseSheetTimestamp(raw: string): Date | null {
    if (!raw) return null;

    // Expect format DD/MM/YYYY HH:MM:SS
    const [datePart, timePart] = raw.split(' ');
    if (!datePart) return null;

    const [dd, mm, yyyy] = datePart.split('/').map((v) => parseInt(v, 10));
    if (!dd || !mm || !yyyy) return null;

    let hh = 0, min = 0, ss = 0;
    if (timePart) {
      const t = timePart.split(':').map((v) => parseInt(v, 10));
      hh = t[0] || 0;
      min = t[1] || 0;
      ss = t[2] || 0;
    }

    // JS Date: months are 0-based
    const d = new Date(yyyy, mm - 1, dd, hh, min, ss);
    if (isNaN(d.getTime())) return null;
    return d;
  }

  // Start/end date based on application timestamp (safe)
  private calculateDates(applicationTimestamp: string) {
    let appliedDate = this.parseSheetTimestamp(applicationTimestamp) || new Date();

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

  async syncFromSheets(): Promise<void> {
    try {
      if (!this.sheets) {
        console.log('❌ Google Sheets not configured. Skipping sync.');
        return;
      }

      if (!this.spreadsheetId) {
        console.log('❌ GOOGLE_SHEETS_SPREADSHEET_ID missing. Skipping sync.');
        return;
      }

      console.log('🚀 Starting Google Sheets sync...');

      const metadata = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const firstSheet =
        metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';
      console.log(`📊 Syncing from sheet: "${firstSheet}"`);

      const headersResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${firstSheet}!A1:Z1`,
      });

      const headers = headersResponse.data.values?.[0] || [];
      console.log('📋 Sheet headers:', headers);

      const getColumnIndex = (searchTerms: string[]): number => {
        for (const term of searchTerms) {
          const index = headers.findIndex((h: string) =>
            h.toLowerCase().includes(term.toLowerCase())
          );
          if (index !== -1) return index;
        }
        return -1;
      };

      const columnMap = {
        timestamp: getColumnIndex(['timestamp', 'time', 'date']),
        name: getColumnIndex(['name', 'full name', 'student name']),
        email: getColumnIndex(['email', 'e-mail', 'email address']),
        phone: getColumnIndex(['phone', 'mobile', 'contact', 'whatsapp']),
        gender: getColumnIndex(['gender', 'sex']),
        country: getColumnIndex(['country', 'nation']),
        domain: getColumnIndex(['domain', 'field', 'department', 'track']),
        address: getColumnIndex(['address', 'location']),
        college: getColumnIndex(['college', 'university', 'institute']),
        degree: getColumnIndex(['degree', 'course', 'program']),
        year: getColumnIndex(['year', 'graduation year', 'passing year']),
        socialMedia: getColumnIndex(['social', 'linkedin', 'portfolio', 'github']),
      };

      console.log('🗺️ Column mapping:', columnMap);

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${firstSheet}!A2:Z`,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('⚠️ No data found in sheet.');
        return;
      }

      let syncedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2;

        try {
          const sheetData: SheetRow = {
            timestamp:
              columnMap.timestamp >= 0 ? row[columnMap.timestamp] || '' : '',
            name: columnMap.name >= 0 ? row[columnMap.name] || '' : '',
            email: columnMap.email >= 0 ? row[columnMap.email] || '' : '',
            phone: columnMap.phone >= 0 ? row[columnMap.phone] || '' : '',
            gender: columnMap.gender >= 0 ? row[columnMap.gender] || '' : '',
            country: columnMap.country >= 0 ? row[columnMap.country] || '' : '',
            domain: columnMap.domain >= 0 ? row[columnMap.domain] || '' : '',
            address: columnMap.address >= 0 ? row[columnMap.address] || '' : '',
            college: columnMap.college >= 0 ? row[columnMap.college] || '' : '',
            degree: columnMap.degree >= 0 ? row[columnMap.degree] || '' : '',
            year: columnMap.year >= 0 ? row[columnMap.year] || '' : '',
            socialMedia:
              columnMap.socialMedia >= 0
                ? row[columnMap.socialMedia] || ''
                : '',
          };

          if (!sheetData.email || sheetData.email.trim() === '') {
            console.log(`⚠️ Row ${rowNumber}: Email empty, skipping.`);
            errorCount++;
            continue;
          }

          const rawTimestamp = sheetData.timestamp?.toString().trim();
          if (!rawTimestamp) {
            console.log(`⚠️ Row ${rowNumber}: Timestamp empty, skipping.`);
            errorCount++;
            continue;
          }

          const parsedAppliedDate = this.parseSheetTimestamp(rawTimestamp);
          if (!parsedAppliedDate) {
            console.log(
              `⚠️ Row ${rowNumber}: Invalid timestamp "${rawTimestamp}", skipping.`
            );
            errorCount++;
            continue;
          }

          const existingIntern = await prisma.intern.findFirst({
            where: { googleSheetRowId: `${rowNumber}` },
          });

          const phase = this.calculatePhase();
          const { startDate, endDate } = this.calculateDates(rawTimestamp);
          const employeeId = this.generateEmployeeId(sheetData.domain, phase);

          if (existingIntern) {
            await prisma.intern.update({
              where: { id: existingIntern.id },
              data: {
                employeeId,
                name: sheetData.name,
                email: sheetData.email,
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
                startDate,
                endDate,
                phase,
              },
            });
            console.log(
              `♻️ Updated row ${rowNumber}: ${sheetData.name} (${sheetData.email})`
            );
            syncedCount++;
            continue;
          }

          await prisma.intern.create({
            data: {
              employeeId,
              name: sheetData.name,
              email: sheetData.email,
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
              startDate,
              endDate,
              phase,
              status: 'pending',
              googleSheetRowId: `${rowNumber}`,
            },
          });

          console.log(
            `✅ Synced row ${rowNumber}: ${sheetData.name} (${employeeId})`
          );
          syncedCount++;
        } catch (err) {
          errorCount++;
          console.error(`❌ Error syncing row ${rowNumber}:`, err);
        }
      }

      console.log(
        `✅ Sync completed. ${syncedCount} interns synced, ${errorCount} errors.`
      );
    } catch (error) {
      console.error('❌ Error syncing from Google Sheets:', error);
    }
  }

  startPeriodicSync(intervalMinutes: number = 5): void {
    console.log(`⏰ Starting periodic sync every ${intervalMinutes} minutes...`);
    this.syncFromSheets().catch(console.error);

    setInterval(() => {
      console.log('🔄 Running scheduled sync...');
      this.syncFromSheets().catch(console.error);
    }, intervalMinutes * 60 * 1000);
  }
}

export default new GoogleSheetsService();
