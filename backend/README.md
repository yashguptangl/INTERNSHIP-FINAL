# Internship Management System - Backend Setup

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
The `.env` file is already configured with:
- ✅ Supabase PostgreSQL database connection
- ✅ Google Sheets ID: `1dj5aVf3Z2jLJOXUpj4m9d1cJKaapexEow9_sdsBkMLE`
- ⚠️ **Update these:**
  - `EMAIL_USER`: Your Gmail address
  - `EMAIL_PASSWORD`: Your Gmail app password
  - `EMAIL_FROM`: Your sender name and email

### 3. Set up Google Sheets API (Required for auto-sync)

#### Option A: Quick Setup (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **Service Account**
5. Create service account (name: `internship-sync-bot`)
6. Click on the service account → **Keys** → **Add Key** → **Create new key** → **JSON**
7. Download the JSON file and save it as `credentials.json` in the backend directory
8. **Important:** Copy the service account email (looks like `xxx@xxx.iam.gserviceaccount.com`)
9. Open your [Google Sheet](https://docs.google.com/spreadsheets/d/1dj5aVf3Z2jLJOXUpj4m9d1cJKaapexEow9_sdsBkMLE/edit)
10. Click **Share** button → Paste the service account email → Give **Editor** access

#### Option B: Without Google Sheets Sync
If you don't need auto-sync from Google Sheets:
- The backend will work without `credentials.json`
- You'll see a warning on startup: "Google Sheets credentials not found"
- You can manually add interns via API or database

### 4. Database Setup
The database is already synced! But if you need to reset:
```bash
npm run prisma:push
```

To view/edit data in browser:
```bash
npm run prisma:studio
```

### 5. Gmail App Password Setup (For sending emails)
1. Go to your [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Search for **App Passwords**
4. Create new app password for "Mail"
5. Copy the 16-character password
6. Update `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=SkillBuild Era <your-email@gmail.com>
   ```

### 6. Start Development Server
```bash
npm run dev
```

Server will start on: `http://localhost:5000`

### 7. Test the API
```bash
# Health check
curl http://localhost:5000/api/health

# Login (default admin)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@technosolutions.com","password":"Admin@123"}'
```

## 📋 Default Admin Credentials
- **Email:** admin@technosolutions.com
- **Password:** Admin@123

⚠️ **Change these in production!** Update in `.env` file.

## 🔄 Google Sheets Auto-Sync

The backend automatically syncs data from Google Sheets every **5 minutes**.

### Expected Sheet Structure (Sheet1):
| Column | Data |
|--------|------|
| A | Timestamp |
| B | Name |
| C | Email |
| D | Phone |
| E | Gender |
| F | Country |
| G | Domain |
| H | Address |
| I | College |
| J | Degree |
| K | Year |
| L | Social Media |

**Start row:** Row 2 (Row 1 should contain headers)

### Manual Sync
Trigger immediate sync via API:
```bash
curl -X POST http://localhost:5000/api/interns/sync/sheets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📬 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info

### Interns Management
- `GET /api/interns` - Get all interns (with filters)
- `GET /api/interns/:employeeId` - Get intern by Employee ID (public, for verification)
- `POST /api/interns/:id/send-offer` - Send offer letter email
- `POST /api/interns/:id/send-certificate` - Send certificate email
- `PUT /api/interns/:id` - Update intern details
- `DELETE /api/interns/:id` - Delete intern
- `POST /api/interns/sync/sheets` - Manually trigger Google Sheets sync

## 🎯 Features

✅ **Automatic Employee ID Generation**
- Format: `TS{DOMAIN_CODE}{YEAR}P{PHASE}{RANDOM}`
- Example: `TSMRN25P31234`

✅ **Phase-based Internship**
- Phase 1: January - April
- Phase 2: May - August  
- Phase 3: September - December

✅ **Email Templates**
- Beautiful HTML offer letters
- Completion certificates
- Verification links

✅ **Real-time Sync**
- Auto-sync from Google Sheets every 5 minutes
- Prevents duplicate entries

✅ **Certificate Verification**
- Public API endpoint for certificate verification
- No authentication required

## 🔧 Troubleshooting

### Database Connection Issues
If you see database connection errors:
```bash
# Test connection
npx prisma db push

# View Prisma Studio
npx prisma studio
```

### Google Sheets Not Syncing
1. Check if `credentials.json` exists
2. Verify service account has editor access to the sheet
3. Check server logs for sync errors
4. Manually trigger sync to see detailed errors

### Email Not Sending
1. Verify Gmail app password is correct (16 characters, no spaces)
2. Check if 2-Step Verification is enabled
3. Try sending a test email from terminal
4. Check server logs for detailed error messages

## 📝 Production Checklist

Before deploying to production:

- [ ] Change default admin password in `.env`
- [ ] Update `JWT_SECRET` with a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` to your production domain
- [ ] Enable HTTPS/SSL
- [ ] Set up proper error logging (e.g., Sentry)
- [ ] Configure CORS for your production domain only
- [ ] Set up database backups
- [ ] Review and restrict database access
- [ ] Use environment-specific credentials
- [ ] Set up monitoring and alerts

## 🚀 Deployment Options

### Vercel / Netlify
- Use serverless functions
- Set environment variables in platform dashboard

### Railway / Render
- Connect GitHub repository
- Auto-deploy on push
- Add PostgreSQL addon

### VPS (DigitalOcean, AWS, etc.)
- Install Node.js 18+
- Clone repository
- Install dependencies
- Set up PM2 for process management
- Configure nginx as reverse proxy
- Set up SSL with Let's Encrypt

## 📚 Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7.x
- **Authentication:** JWT
- **Email:** Nodemailer (Gmail)
- **Google Sheets:** googleapis
- **Validation:** express-validator

## 🆘 Need Help?

Check the logs:
```bash
# View real-time logs
npm run dev

# Check specific errors
node dist/server.js 2>&1 | tee server.log
```

Common issues are usually:
1. Missing environment variables
2. Database connection problems
3. Google Sheets API not configured
4. Gmail app password issues

---

Made with ❤️ for SkillBuild Era Internship Management
