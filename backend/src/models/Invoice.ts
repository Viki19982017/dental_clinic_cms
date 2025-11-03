import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface InvoiceAttributes {
  id: number;
  patientId: number;
  treatmentId?: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public patientId!: number;
  public treatmentId?: number;
  public invoiceNumber!: string;
  public invoiceDate!: Date;
  public dueDate!: Date;
  public totalAmount!: number;
  public paidAmount!: number;
  public balanceAmount!: number;
  public paymentStatus!: string;
  public paymentMethod?: string;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
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
    treatmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'treatments',
        key: 'id'
      }
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    invoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('Pending', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('Cash', 'Credit Card', 'Debit Card', 'Insurance', 'Check', 'Online Transfer'),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'invoices',
    timestamps: true
  }
);

export default Invoice;

