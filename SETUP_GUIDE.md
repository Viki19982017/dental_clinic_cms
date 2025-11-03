# 🚀 Quick Setup Guide for Dental Clinic CMS

This guide will help you get the application up and running quickly.

## 🔧 Step-by-Step Setup

### 1. Install PostgreSQL (if not already installed)

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run the installer and set a password for the postgres user
- Remember this password for later use

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

Open terminal/command prompt:

```bash
# Windows (use PostgreSQL SQL Shell or pgAdmin)
# macOS/Linux
psql -U postgres

# Inside psql:
CREATE DATABASE dental_clinic_db;
\q
```

### 3. Project Setup

```bash
# Install backend dependencies
cd backend
npm install

# Copy environment file
cp .env.example .env
```

Edit `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dental_clinic_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_random_secret_key_here
```

```bash
# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Seed Database (Optional)

This creates sample data for testing:

```bash
cd backend
npx ts-node src/scripts/seed.ts
```

This will create:
- An admin user (admin@dental.com / admin123)
- Two dentists
- A receptionist
- Three sample patients
- Sample appointments, treatments, and invoices

### 5. Run the Application

**Option 1: From root directory (runs both)**
```bash
cd ..  # go to root
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Login with:**
- Email: admin@dental.com
- Password: admin123

## 🎯 What to Do After Setup

1. **Add Staff Members** - Go to Staff section and add dentists, receptionists
2. **Add Patients** - Register patients with their information
3. **Schedule Appointments** - Create appointments for patients
4. **Record Treatments** - Document treatments provided
5. **Generate Invoices** - Create and manage invoices

## 🔍 Testing the Features

### Test Patient Management:
1. Go to "Patients" page
2. Click "+ Add Patient"
3. Fill in the form and save
4. Click on a patient name to view details
5. Try searching for patients

### Test Appointments:
1. Go to "Appointments" page
2. Click "+ New Appointment"
3. Select patient, dentist, date, and time
4. Change appointment status using the dropdown
5. Filter by date or status

### Test Dashboard:
1. View the statistics cards
2. Check "Recent Appointments" table
3. Use quick action shortcuts

## ⚠️ Common Issues

### Issue: Database connection error
**Solution:** 
- Check if PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

### Issue: Port already in use
**Solution:**
- Change PORT in `backend/.env` (default: 5000)
- Change port in `frontend/vite.config.ts` (default: 3000)

### Issue: Module not found
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Cannot login
**Solution:**
- Run the seed script to create default users
- Or manually create a user in the database
- Check JWT_SECRET is set in `.env`

## 📱 Mobile Testing

The application is responsive. Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## 🔒 Security Notes

For production deployment:
1. Change JWT_SECRET to a strong random value
2. Use environment-specific database credentials
3. Enable HTTPS
4. Set up proper CORS origins
5. Use strong passwords for all users
6. Regular backups of the database

## 📞 Need Help?

Check the main README.md for:
- Complete feature list
- API documentation
- Project structure
- Troubleshooting guide

---

Happy Coding! 🦷✨

