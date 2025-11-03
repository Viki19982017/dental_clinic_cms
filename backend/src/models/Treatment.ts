import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TreatmentAttributes {
  id: number;
  patientId: number;
  dentistId: number;
  appointmentId?: number;
  treatmentType: string;
  treatmentCode: string;
  toothNumber?: string;
  diagnosis: string;
  procedure: string;
  treatmentDate: Date;
  status: string;
  cost: number;
  notes?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TreatmentCreationAttributes extends Optional<TreatmentAttributes, 'id'> {}

class Treatment extends Model<TreatmentAttributes, TreatmentCreationAttributes> implements TreatmentAttributes {
  public id!: number;
  public patientId!: number;
  public dentistId!: number;
  public appointmentId?: number;
  public treatmentType!: string;
  public treatmentCode!: string;
  public toothNumber?: string;
  public diagnosis!: string;
  public procedure!: string;
  public treatmentDate!: Date;
  public status!: string;
  public cost!: number;
  public notes?: string;
  public beforePhoto?: string;
  public afterPhoto?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Treatment.init(
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
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'appointments',
        key: 'id'
      }
    },
    treatmentType: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    treatmentCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'CDT Code'
    },
    toothNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    procedure: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    treatmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Planned', 'In Progress', 'Completed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Planned'
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    beforePhoto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    afterPhoto: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'treatments',
    timestamps: true
  }
);

export default Treatment;

