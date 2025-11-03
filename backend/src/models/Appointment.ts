import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AppointmentAttributes {
  id: number;
  patientId: number;
  dentistId: number;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  appointmentType: string;
  status: string;
  reason: string;
  notes?: string;
  reminderSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id'> {}

class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: number;
  public patientId!: number;
  public dentistId!: number;
  public appointmentDate!: Date;
  public appointmentTime!: string;
  public duration!: number;
  public appointmentType!: string;
  public status!: string;
  public reason!: string;
  public notes?: string;
  public reminderSent!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    dentistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'id'
      }
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    appointmentTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      comment: 'Duration in minutes'
    },
    appointmentType: {
      type: DataTypes.ENUM('Checkup', 'Cleaning', 'Filling', 'Root Canal', 'Extraction', 'Orthodontics', 'Consultation', 'Emergency', 'Other'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'),
      allowNull: false,
      defaultValue: 'Scheduled'
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'appointments',
    timestamps: true
  }
);

export default Appointment;

