import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PatientAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  medicalHistory?: string;
  allergies?: string;
  bloodGroup?: string;
  photo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PatientCreationAttributes extends Optional<PatientAttributes, 'id'> {}

class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public dateOfBirth!: Date;
  public gender!: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public emergencyContactName!: string;
  public emergencyContactPhone!: string;
  public insuranceProvider?: string;
  public insurancePolicyNumber?: string;
  public medicalHistory?: string;
  public allergies?: string;
  public bloodGroup?: string;
  public photo?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    zipCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    emergencyContactName: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    emergencyContactPhone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    insuranceProvider: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    insurancePolicyNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bloodGroup: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'patients',
    timestamps: true
  }
);

export default Patient;

