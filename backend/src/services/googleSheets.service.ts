import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
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

  private async initializeAuth() {
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './credentials.json';
    
    if (!fs.existsSync(credentialsPath)) {
      console.warn('Google Sheets credentials not found. Sheet sync will be disabled.');
      return;
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  // Generate unique Employee ID
  private generateEmployeeId(domain: string, phase: number): string {
    const domainCodes: Record<string, string> = {
      'MERN Stack': 'MRN',
      'Java Development': 'JAV',
      'Data Science': 'DTS',
      'AI/ML': 'AIM',
      'Cyber Security': 'CYB',
    };

    const year = new Date().getFullYear().toString().slice(-2);
    const code = domainCodes[domain] || 'GEN';
    const random = Math.floor(1000 + Math.random() * 9000);
    
    return `TS${code}${year}P${phase}${random}`;
  }

  // Calculate phase based on current date
  private calculatePhase(): number {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    
    if (month >= 0 && month <= 3) return 1; // Jan-Apr
    if (month >= 4 && month <= 7) return 2; // May-Aug
    return 3; // Sep-Dec
  }

  // Calculate start and end dates based on application timestamp
  private calculateDates(applicationTimestamp: string) {
    const appliedDate = new Date(applicationTimestamp);
    const day = appliedDate.getDate();
    const month = appliedDate.getMonth();
    const year = appliedDate.getFullYear();
    
    let startDate: Date;

    if (day >= 1 && day <= 10) {
      // Form filled 1-10: Start on 11th of same month
      startDate = new Date(year, month, 11);
    } else if (day >= 11 && day <= 20) {
      // Form filled 11-20: Start on 21st of same month
      startDate = new Date(year, month, 21);
    } else {
      // Form filled 21-31: Start on 1st of next month
      startDate = new Date(year, month + 1, 1);
    }

    // End date is 1 month (30 days) after start date
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    return { startDate, endDate };
  }

  // Sync data from Google Sheets to database
  async syncFromSheets(): Promise<void> {
    try {
      if (!this.sheets) {
        console.log('Google Sheets not configured. Skipping sync.');
        return;
      }

      // Get sheet metadata to find the first sheet name
      const metadata = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const firstSheet = metadata.data.sheets?.[0]?.properties?.title || 'Sheet1';
      console.log(`📊 Syncing from sheet: "${firstSheet}"`);

      // First, read the headers to understand column mapping
      const headersResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${firstSheet}!A1:Z1`, // Read all headers
      });

      const headers = headersResponse.data.values?.[0] || [];
      console.log('📋 Sheet headers:', headers);

      // Create a mapping of column names to indices
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
        range: `${firstSheet}!A2:Z`, // Start from row 2, read all columns
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('No data found in sheets.');
        return;
      }

      let syncedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2; // +2 because we start from A2

        try {
          const sheetData: SheetRow = {
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

          console.log(`Row ${rowNumber} data:`, { name: sheetData.name, email: sheetData.email });

          // Skip if email is empty
          if (!sheetData.email || sheetData.email.trim() === '') {
            console.log(`⚠️ Row ${rowNumber}: Email is empty. Skipping.`);
            errorCount++;
            continue;
          }

          // Check if this row was already synced using googleSheetRowId
          const existingIntern = await prisma.intern.findFirst({
            where: { googleSheetRowId: `${rowNumber}` },
          });

          if (existingIntern) {
            // Update existing intern with latest data from sheets
            await prisma.intern.update({
              where: { id: existingIntern.id },
              data: {
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
              },
            });
            console.log(`✅ Updated row ${rowNumber}: ${sheetData.name} (${sheetData.email})`);
            syncedCount++;
            continue;
          }

          const phase = this.calculatePhase();
          const { startDate, endDate } = this.calculateDates(sheetData.timestamp);
          const employeeId = this.generateEmployeeId(sheetData.domain, phase);

          // Create intern in database
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
              appliedDate: new Date(sheetData.timestamp),
              startDate,
              endDate,
              phase,
              status: 'pending',
              googleSheetRowId: `${rowNumber}`,
            },
          });

          syncedCount++;
          console.log(`Synced intern: ${sheetData.name} (${employeeId})`);
        } catch (error) {
          errorCount++;
          console.error(`Error syncing row ${rowNumber}:`, error);
        }
      }

      console.log(`Sync completed: ${syncedCount} interns synced, ${errorCount} errors`);
    } catch (error) {
      console.error('Error syncing from Google Sheets:', error);
      throw error;
    }
  }

  // Start periodic sync (every 5 minutes)
  startPeriodicSync(intervalMinutes: number = 5): void {
    console.log(`Starting periodic sync every ${intervalMinutes} minutes...`);
    
    // Initial sync
    this.syncFromSheets().catch(console.error);

    // Set up interval
    setInterval(() => {
      console.log('Running scheduled sync...');
      this.syncFromSheets().catch(console.error);
    }, intervalMinutes * 60 * 1000);
  }
}

export default new GoogleSheetsService();