# 🦷 Dental Clinic Management System

A comprehensive full-stack Dental Clinic Management System built with **Node.js, Express, PostgreSQL, Sequelize** for the backend and **React with TypeScript** for the frontend.

## 📋 Features

### Core Features Implemented

- ✅ **Patient Management**
  - Complete patient records with personal and medical information
  - Search and filter patients
  - Patient detail view with appointments, treatments, and billing history
  - Medical history and allergy tracking
  - Insurance information management

- ✅ **Appointment Management**
  - Schedule, edit, and cancel appointments
  - Calendar view with date and status filtering
  - Appointment type categorization
  - Real-time status updates
  - Dentist assignment

- ✅ **Treatment Management**
  - Treatment records with diagnosis and procedures
  - Treatment status tracking
  - Cost management
  - Patient and dentist association

- ✅ **Billing & Invoicing**
  - Invoice generation with automatic numbering
  - Payment tracking (full/partial payments)
  - Payment status management
  - Due date tracking

- ✅ **Staff Management**
  - Staff profiles with roles and specializations
  - Role-based access (Admin, Dentist, Receptionist, etc.)
  - License tracking for dentists

- ✅ **Dashboard**
  - Key performance indicators
  - Today's appointments overview
  - Revenue statistics
  - Quick action shortcuts

- ✅ **Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control
  - Password encryption with bcrypt

- ✅ **Redis Caching**
  - Performance optimization with Redis
  - Automatic cache for dashboard statistics
  - Cache utilities and middleware
  - Smart cache invalidation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **Redis** - Caching layer
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Vite** - Build tool
- **Pure CSS** - Styling (no external libraries)

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher) - Optional but recommended
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dental_clinic_cms
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dental_clinic_db;

# Exit psql
\q
```

### 3. Redis Setup (Optional but Recommended)

Install and start Redis:

**Windows:** See `backend/REDIS_SETUP.md`

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dental_clinic_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

**Note:** If Redis is not installed, set `REDIS_ENABLED=false` - the app will work without caching.

### 5. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

### 6. Run the Application

#### Option 1: Run Backend and Frontend Separately

**Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

#### Option 2: Run Both Concurrently (from root)

```bash
npm run dev
```

## 🗄️ Database Schema

The system uses the following main tables:

- **patients** - Patient information and medical records
- **staff** - Staff members and their roles
- **appointments** - Appointment scheduling and tracking
- **treatments** - Treatment records and procedures
- **invoices** - Billing and payment information

The database will be automatically created and synchronized when you first run the backend server.

## 🔐 Default Login Credentials

After the database is set up, create an admin user:

```sql
INSERT INTO staff (
  "firstName", "lastName", email, password, phone, role, 
  "dateOfJoining", address, city, state, "zipCode", "isActive", 
  "createdAt", "updatedAt"
) VALUES (
  'Admin', 'User', 'admin@dental.com', 
  '$2b$10$YourHashedPasswordHere', '+1234567890', 'Admin',
  '2024-01-01', '123 Main St', 'New York', 'NY', '10001', true,
  NOW(), NOW()
);
```

**To hash a password for testing:**
```javascript
const bcrypt = require('bcrypt');
const password = await bcrypt.hash('admin123', 10);
console.log(password);
```

Or use the demo credentials mentioned in the login page.

## 📁 Project Structure

```
dental_clinic_cms/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── Patient.ts
│   │   │   ├── Staff.ts
│   │   │   ├── Appointment.ts
│   │   │   ├── Treatment.ts
│   │   │   ├── Invoice.ts
│   │   │   └── index.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── patientController.ts
│   │   │   ├── appointmentController.ts
│   │   │   ├── treatmentController.ts
│   │   │   ├── invoiceController.ts
│   │   │   ├── staffController.ts
│   │   │   └── dashboardController.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── patientRoutes.ts
│   │   │   ├── appointmentRoutes.ts
│   │   │   ├── treatmentRoutes.ts
│   │   │   ├── invoiceRoutes.ts
│   │   │   ├── staffRoutes.ts
│   │   │   └── dashboardRoutes.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   └── AppointmentForm.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Patients.tsx
│   │   │   ├── PatientDetail.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── Treatments.tsx
│   │   │   ├── Invoices.tsx
│   │   │   └── Staff.tsx
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── Layout.css
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Patients.css
│   │   │   ├── PatientDetail.css
│   │   │   ├── Appointments.css
│   │   │   ├── Staff.css
│   │   │   └── Common.css
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Patients
- `GET /api/patients` - Get all patients (with search & pagination)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Deactivate patient

### Appointments
- `GET /api/appointments` - Get all appointments (with filters)
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Treatments
- `GET /api/treatments` - Get all treatments (with filters)
- `GET /api/treatments/:id` - Get treatment by ID
- `POST /api/treatments` - Create new treatment
- `PUT /api/treatments/:id` - Update treatment
- `DELETE /api/treatments/:id` - Delete treatment

### Invoices
- `GET /api/invoices` - Get all invoices (with filters)
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Staff
- `GET /api/staff` - Get all staff (with filters)
- `GET /api/staff/dentists` - Get all dentists
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff (Admin only)
- `PUT /api/staff/:id` - Update staff (Admin only)
- `DELETE /api/staff/:id` - Deactivate staff (Admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Clean Interface** - Modern and intuitive UI
- **Pure CSS** - No external CSS frameworks
- **Custom Components** - Reusable form components and modals
- **Color-coded Status** - Visual status indicators for appointments and payments
- **Real-time Updates** - Instant UI updates after operations

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- SQL injection prevention (Sequelize ORM)
- Input validation

## 🛣️ Roadmap / Future Enhancements

Based on the requirements document, future additions could include:

- [ ] Email/SMS notifications for appointments
- [ ] Online appointment booking portal for patients
- [ ] Document upload and management
- [ ] Dental charting (Odontogram)
- [ ] Treatment planning with cost estimation
- [ ] Inventory management for supplies
- [ ] Multi-clinic support
- [ ] Advanced reporting and analytics
- [ ] Patient mobile app
- [ ] Calendar integration
- [ ] Prescription management
- [ ] Insurance claim processing

## 📄 License

MIT License

## 👨‍💻 Development

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Environment Variables

Make sure to set appropriate environment variables for production:
- Use strong JWT secrets
- Enable HTTPS
- Set proper CORS origins
- Use environment-specific database credentials

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change ports in `.env` (backend) or `vite.config.ts` (frontend)
- Kill processes using the ports

### Module Not Found Errors
- Run `npm install` in both backend and frontend directories
- Clear node_modules and reinstall if needed

## 📞 Support

For issues and questions, please check the documentation or create an issue in the repository.

---

Built with ❤️ for modern dental practices

