# 🔌 API Documentation - Dental Clinic CMS

Base URL: `http://localhost:5000/api`

## Authentication

All endpoints except `/auth/login` require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@dental.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@dental.com",
    "role": "Admin",
    "photo": null
  }
}
```

### Get Profile
```http
GET /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@dental.com",
  "role": "Admin",
  "phone": "+1234567890",
  // ... other fields
}
```

---

## 👥 Patient Endpoints

### Get All Patients
```http
GET /patients?search=john&page=1&limit=10
```

**Query Parameters:**
- `search` (optional) - Search by name, email, or phone
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Results per page

**Response:**
```json
{
  "patients": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### Get Patient by ID
```http
GET /patients/:id
```

**Response:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "appointments": [...],
  "treatments": [...],
  "invoices": [...]
}
```

### Create Patient
```http
POST /patients
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567891",
  "insuranceProvider": "Delta Dental",
  "insurancePolicyNumber": "DD123456",
  "medicalHistory": "No significant history",
  "allergies": "Penicillin",
  "bloodGroup": "O+"
}
```

### Update Patient
```http
PUT /patients/:id
```

**Request Body:** Same as Create Patient (partial updates allowed)

### Delete Patient
```http
DELETE /patients/:id
```

**Response:**
```json
{
  "message": "Patient deactivated successfully"
}
```

---

## 📅 Appointment Endpoints

### Get All Appointments
```http
GET /appointments?date=2024-01-15&dentistId=1&status=Scheduled
```

**Query Parameters:**
- `date` (optional) - Filter by date (YYYY-MM-DD)
- `dentistId` (optional) - Filter by dentist ID
- `patientId` (optional) - Filter by patient ID
- `status` (optional) - Filter by status

**Response:**
```json
[
  {
    "id": 1,
    "appointmentDate": "2024-01-15",
    "appointmentTime": "09:00",
    "duration": 30,
    "appointmentType": "Checkup",
    "status": "Scheduled",
    "reason": "Regular checkup",
    "patient": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe"
    },
    "dentist": {
      "id": 1,
      "firstName": "Dr. Smith",
      "specialization": "General Dentistry"
    }
  }
]
```

### Get Today's Appointments
```http
GET /appointments/today
```

### Get Appointment by ID
```http
GET /appointments/:id
```

### Create Appointment
```http
POST /appointments
```

**Request Body:**
```json
{
  "patientId": 1,
  "dentistId": 1,
  "appointmentDate": "2024-01-15",
  "appointmentTime": "09:00",
  "duration": 30,
  "appointmentType": "Checkup",
  "status": "Scheduled",
  "reason": "Regular checkup",
  "notes": "First visit"
}
```

**Appointment Types:**
- Checkup
- Cleaning
- Filling
- Root Canal
- Extraction
- Orthodontics
- Consultation
- Emergency
- Other

**Status Options:**
- Scheduled
- Confirmed
- In Progress
- Completed
- Cancelled
- No Show

### Update Appointment
```http
PUT /appointments/:id
```

### Delete Appointment
```http
DELETE /appointments/:id
```

---

## 🦷 Treatment Endpoints

### Get All Treatments
```http
GET /treatments?patientId=1&status=Completed
```

**Query Parameters:**
- `patientId` (optional) - Filter by patient ID
- `dentistId` (optional) - Filter by dentist ID
- `status` (optional) - Filter by status

### Get Treatment by ID
```http
GET /treatments/:id
```

### Create Treatment
```http
POST /treatments
```

**Request Body:**
```json
{
  "patientId": 1,
  "dentistId": 1,
  "appointmentId": 1,
  "treatmentType": "Dental Filling",
  "treatmentCode": "D2391",
  "toothNumber": "14",
  "diagnosis": "Tooth decay",
  "procedure": "Composite filling",
  "treatmentDate": "2024-01-15",
  "status": "Completed",
  "cost": 250.00,
  "notes": "Patient tolerated well"
}
```

**Status Options:**
- Planned
- In Progress
- Completed
- Cancelled

### Update Treatment
```http
PUT /treatments/:id
```

### Delete Treatment
```http
DELETE /treatments/:id
```

---

## 💰 Invoice Endpoints

### Get All Invoices
```http
GET /invoices?patientId=1&paymentStatus=Pending
```

**Query Parameters:**
- `patientId` (optional) - Filter by patient ID
- `paymentStatus` (optional) - Filter by payment status

### Get Invoice by ID
```http
GET /invoices/:id
```

### Create Invoice
```http
POST /invoices
```

**Request Body:**
```json
{
  "patientId": 1,
  "treatmentId": 1,
  "invoiceDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "totalAmount": 250.00,
  "paidAmount": 100.00,
  "paymentMethod": "Credit Card",
  "notes": "Partial payment received"
}
```

**Payment Status (auto-calculated):**
- Pending
- Partially Paid
- Paid
- Overdue
- Cancelled

**Payment Methods:**
- Cash
- Credit Card
- Debit Card
- Insurance
- Check
- Online Transfer

### Update Invoice
```http
PUT /invoices/:id
```

### Delete Invoice
```http
DELETE /invoices/:id
```

---

## 👨‍⚕️ Staff Endpoints

### Get All Staff
```http
GET /staff?role=Dentist&isActive=true
```

**Query Parameters:**
- `role` (optional) - Filter by role
- `isActive` (optional, default: true) - Filter by active status

### Get All Dentists
```http
GET /staff/dentists
```

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "specialization": "General Dentistry",
    "photo": null
  }
]
```

### Get Staff by ID
```http
GET /staff/:id
```

### Create Staff (Admin Only)
```http
POST /staff
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@dental.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "Dentist",
  "specialization": "General Dentistry",
  "licenseNumber": "DDS-12345",
  "dateOfJoining": "2024-01-01",
  "address": "123 Dental St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

**Role Options:**
- Admin
- Dentist
- Receptionist
- Hygienist
- Assistant

### Update Staff (Admin Only)
```http
PUT /staff/:id
```

### Delete Staff (Admin Only)
```http
DELETE /staff/:id
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
```http
GET /dashboard/stats
```

**Response:**
```json
{
  "totalPatients": 150,
  "todayAppointments": 8,
  "monthlyRevenue": 15000.00,
  "pendingPayments": 3500.00,
  "recentAppointments": [...],
  "appointmentsByStatus": [
    {
      "status": "Scheduled",
      "count": 12
    },
    {
      "status": "Completed",
      "count": 45
    }
  ]
}
```

---

## 📝 Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider adding rate limiting middleware.

## 📌 Notes

1. All dates should be in ISO 8601 format (YYYY-MM-DD)
2. Times should be in 24-hour format (HH:MM)
3. Amounts should be decimal numbers with 2 decimal places
4. Deleted records are soft-deleted (isActive flag set to false)
5. Passwords are automatically hashed before storage
6. JWT tokens expire after 7 days (configurable in .env)

---

## 🧪 Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dental.com","password":"admin123"}'

# Get patients (with token)
curl http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the endpoints
2. Set up environment variables for base URL and token
3. Use the Authorization tab to set Bearer token
4. Test all endpoints

---

**API Version:** 1.0.0  
**Last Updated:** 2024

