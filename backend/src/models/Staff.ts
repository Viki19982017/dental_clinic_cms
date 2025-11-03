import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';

interface StaffAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  dateOfJoining: Date;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  photo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StaffCreationAttributes extends Optional<StaffAttributes, 'id'> {}

class Staff extends Model<StaffAttributes, StaffCreationAttributes> implements StaffAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public role!: string;
  public specialization?: string;
  public licenseNumber?: string;
  public dateOfJoining!: Date;
  public address!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public photo?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

Staff.init(
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Dentist', 'Receptionist', 'Hygienist', 'Assistant'),
      allowNull: false
    },
    specialization: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    licenseNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dateOfJoining: {
      type: DataTypes.DATE,
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
    tableName: 'staff',
    timestamps: true,
    hooks: {
      beforeCreate: async (staff: Staff) => {
        if (staff.password) {
          staff.password = await bcrypt.hash(staff.password, 10);
        }
      },
      beforeUpdate: async (staff: Staff) => {
        if (staff.changed('password')) {
          staff.password = await bcrypt.hash(staff.password, 10);
        }
      }
    }
  }
);

export default Staff;

