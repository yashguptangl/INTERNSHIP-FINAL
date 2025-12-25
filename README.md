# SkillBuild Era Internship Management - Full Workflow

## 1. Project Structure
- **backend/**: Node.js/TypeScript API, handles database, email, Google Sheets sync, PDF generation.
- **frontened/skillbuildera/**: React frontend for admin and intern interaction.

## 2. Google Sheets Sync
- Google Sheets is used as the source of truth for intern applications.
- Credentials for Google Sheets API are stored in `backend/credentials.json` and referenced in `.env` as `GOOGLE_SHEETS_CREDENTIALS_PATH`.
- Spreadsheet ID is set in `.env` as `GOOGLE_SHEETS_SPREADSHEET_ID`.
- On backend start, the service syncs data from Google Sheets to the database, parsing timestamps and intern details.
- Periodic sync runs every few minutes to keep data updated.

## 3. Database
- PostgreSQL database (Supabase) is used.
- Connection details are in `.env` as `DATABASE_URL` and `DIRECT_URL`.
- Prisma ORM manages models and migrations.

## 4. Email Sending (Offer Letter & Domain PDF)
- Email configuration is set in `.env` (Zoho SMTP recommended).
- When an intern is selected, the backend generates an offer letter PDF and selects the correct domain PDF from `src/assets/domain-pdfs/` based on the intern's domain.
- Both PDFs are sent as attachments to the intern's email.
- Domain-to-PDF mapping is flexible and supports various domain name formats.

## 5. Certificate Generation
- On successful internship completion, a certificate PDF is generated and emailed to the intern.

## 6. Environment Variables (.env)
- Set all required variables:
  - `DATABASE_URL`, `DIRECT_URL`, `PORT`, `NODE_ENV`
  - `JWT_SECRET`, `JWT_EXPIRES_IN`
  - `GOOGLE_SHEETS_CREDENTIALS_PATH`, `GOOGLE_SHEETS_SPREADSHEET_ID`
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`
  - `FRONTEND_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`

## 7. How to Run
1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontened/skillbuildera && npm install`
2. Set up `.env` in backend and place `credentials.json` in backend folder.
3. Run migrations: `npx prisma migrate deploy` or `npx prisma migrate reset`
4. Start backend: `npm run dev` (in backend)
5. Start frontend: `npm run dev` (in frontened/skillbuildera)

## 8. Adding/Updating Domain PDFs
- Place new PDF in `backend/src/assets/domain-pdfs/`.
- Update mapping in `email.service.ts` if new domain name is added.

## 9. Troubleshooting
- **Google Sheets not configured**: Check `.env` and credentials file.
- **No PDF found for domain**: Ensure correct mapping and PDF file exists.
- **Invalid timestamp**: Google Sheet date format should be `DD/MM/YYYY HH:mm:ss`.

## 10. Security
- Never commit credentials or sensitive data to GitHub.
- Use environment variables for all secrets.

---

For any issues, contact the SkillBuild Era admin team.
