import sequelize from '../config/database';
import Patient from './Patient';
import Staff from './Staff';
import Appointment from './Appointment';
import Treatment from './Treatment';
import Invoice from './Invoice';

// Define associations
Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

Staff.hasMany(Appointment, { foreignKey: 'dentistId', as: 'appointments' });
Appointment.belongsTo(Staff, { foreignKey: 'dentistId', as: 'dentist' });

Patient.hasMany(Treatment, { foreignKey: 'patientId', as: 'treatments' });
Treatment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

Staff.hasMany(Treatment, { foreignKey: 'dentistId', as: 'treatments' });
Treatment.belongsTo(Staff, { foreignKey: 'dentistId', as: 'dentist' });

Appointment.hasMany(Treatment, { foreignKey: 'appointmentId', as: 'treatments' });
Treatment.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

Patient.hasMany(Invoice, { foreignKey: 'patientId', as: 'invoices' });
Invoice.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

Treatment.hasOne(Invoice, { foreignKey: 'treatmentId', as: 'invoice' });
Invoice.belongsTo(Treatment, { foreignKey: 'treatmentId', as: 'treatment' });

export {
  sequelize,
  Patient,
  Staff,
  Appointment,
  Treatment,
  Invoice
};

