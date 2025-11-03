/**
 * Database Seeding Script
 * Run this script to populate the database with sample data for testing
 * 
 * Usage: ts-node src/scripts/seed.ts
 */

import { sequelize, Staff, Patient, Appointment, Treatment, Invoice } from '../models';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // WARNING: This will drop existing tables
    console.log('✅ Database synced');

    // Create Admin Staff
    const admin = await Staff.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@dental.com',
      password: 'admin123',
      phone: '+1-555-0100',
      role: 'Admin',
      dateOfJoining: new Date('2020-01-01'),
      address: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isActive: true
    });
    console.log('✅ Admin user created');

    // Create Dentists
    const dentist1 = await Staff.create({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@dental.com',
      password: 'dentist123',
      phone: '+1-555-0101',
      role: 'Dentist',
      specialization: 'General Dentistry',
      licenseNumber: 'DDS-12345',
      dateOfJoining: new Date('2020-03-15'),
      address: '456 Dental Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      isActive: true
    });

    const dentist2 = await Staff.create({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@dental.com',
      password: 'dentist123',
      phone: '+1-555-0102',
      role: 'Dentist',
      specialization: 'Orthodontics',
      licenseNumber: 'DDS-67890',
      dateOfJoining: new Date('2021-06-01'),
      address: '789 Smile Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      isActive: true
    });
    console.log('✅ Dentists created');

    // Create Receptionist
    await Staff.create({
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@dental.com',
      password: 'reception123',
      phone: '+1-555-0103',
      role: 'Receptionist',
      dateOfJoining: new Date('2021-01-10'),
      address: '321 Front Desk Rd',
      city: 'New York',
      state: 'NY',
      zipCode: '10004',
      isActive: true
    });
    console.log('✅ Receptionist created');

    // Create Sample Patients
    const patient1 = await Patient.create({
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@email.com',
      phone: '+1-555-1001',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'Male',
      address: '100 Patient Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10010',
      emergencyContactName: 'Lisa Brown',
      emergencyContactPhone: '+1-555-1002',
      insuranceProvider: 'Delta Dental',
      insurancePolicyNumber: 'DD123456',
      medicalHistory: 'No significant medical history',
      allergies: 'Penicillin',
      bloodGroup: 'O+',
      isActive: true
    });

    const patient2 = await Patient.create({
      firstName: 'Jennifer',
      lastName: 'Wilson',
      email: 'jennifer.wilson@email.com',
      phone: '+1-555-2001',
      dateOfBirth: new Date('1990-08-22'),
      gender: 'Female',
      address: '200 Health Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10011',
      emergencyContactName: 'Robert Wilson',
      emergencyContactPhone: '+1-555-2002',
      insuranceProvider: 'Cigna',
      insurancePolicyNumber: 'CG789012',
      medicalHistory: 'Diabetes Type 2',
      allergies: 'None',
      bloodGroup: 'A+',
      isActive: true
    });

    const patient3 = await Patient.create({
      firstName: 'David',
      lastName: 'Martinez',
      email: 'david.martinez@email.com',
      phone: '+1-555-3001',
      dateOfBirth: new Date('1978-12-10'),
      gender: 'Male',
      address: '300 Wellness St',
      city: 'New York',
      state: 'NY',
      zipCode: '10012',
      emergencyContactName: 'Maria Martinez',
      emergencyContactPhone: '+1-555-3002',
      medicalHistory: 'High blood pressure',
      allergies: 'Latex',
      bloodGroup: 'B+',
      isActive: true
    });
    console.log('✅ Patients created');

    // Create Sample Appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointment1 = await Appointment.create({
      patientId: patient1.id,
      dentistId: dentist1.id,
      appointmentDate: today,
      appointmentTime: '09:00',
      duration: 30,
      appointmentType: 'Checkup',
      status: 'Scheduled',
      reason: 'Regular checkup',
      reminderSent: false
    });

    await Appointment.create({
      patientId: patient2.id,
      dentistId: dentist2.id,
      appointmentDate: today,
      appointmentTime: '10:30',
      duration: 60,
      appointmentType: 'Orthodontics',
      status: 'Confirmed',
      reason: 'Braces adjustment',
      reminderSent: true
    });

    await Appointment.create({
      patientId: patient3.id,
      dentistId: dentist1.id,
      appointmentDate: tomorrow,
      appointmentTime: '14:00',
      duration: 45,
      appointmentType: 'Cleaning',
      status: 'Scheduled',
      reason: 'Teeth cleaning',
      reminderSent: false
    });
    console.log('✅ Appointments created');

    // Create Sample Treatments
    const treatment1 = await Treatment.create({
      patientId: patient1.id,
      dentistId: dentist1.id,
      appointmentId: appointment1.id,
      treatmentType: 'Dental Filling',
      treatmentCode: 'D2391',
      toothNumber: '14',
      diagnosis: 'Tooth decay',
      procedure: 'Composite filling on tooth #14',
      treatmentDate: new Date('2024-01-15'),
      status: 'Completed',
      cost: 250.00,
      notes: 'Patient tolerated procedure well'
    });

    await Treatment.create({
      patientId: patient2.id,
      dentistId: dentist2.id,
      treatmentType: 'Orthodontic Braces',
      treatmentCode: 'D8080',
      diagnosis: 'Malocclusion',
      procedure: 'Comprehensive orthodontic treatment',
      treatmentDate: new Date('2024-02-01'),
      status: 'In Progress',
      cost: 5000.00,
      notes: 'Treatment plan: 18-24 months'
    });
    console.log('✅ Treatments created');

    // Create Sample Invoices
    await Invoice.create({
      patientId: patient1.id,
      treatmentId: treatment1.id,
      invoiceNumber: 'INV-0001',
      invoiceDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      totalAmount: 250.00,
      paidAmount: 250.00,
      balanceAmount: 0.00,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card'
    });

    await Invoice.create({
      patientId: patient2.id,
      invoiceNumber: 'INV-0002',
      invoiceDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-01'),
      totalAmount: 5000.00,
      paidAmount: 2000.00,
      balanceAmount: 3000.00,
      paymentStatus: 'Partially Paid',
      paymentMethod: 'Insurance'
    });

    await Invoice.create({
      patientId: patient3.id,
      invoiceNumber: 'INV-0003',
      invoiceDate: new Date('2024-02-10'),
      dueDate: new Date('2024-03-10'),
      totalAmount: 150.00,
      paidAmount: 0.00,
      balanceAmount: 150.00,
      paymentStatus: 'Pending'
    });
    console.log('✅ Invoices created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Email: admin@dental.com');
    console.log('Password: admin123');
    console.log('\nOther users:');
    console.log('Dentist: john.smith@dental.com / dentist123');
    console.log('Dentist: sarah.johnson@dental.com / dentist123');
    console.log('Receptionist: emily.davis@dental.com / reception123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

seed();

