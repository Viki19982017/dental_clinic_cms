import { Request, Response } from 'express';
import { Patient, Appointment, Treatment, Invoice } from '../models';
import { Op } from 'sequelize';

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = { isActive: true };

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Patient.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      patients: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit))
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [
        { model: Appointment, as: 'appointments' },
        { model: Treatment, as: 'treatments' },
        { model: Invoice, as: 'invoices' }
      ]
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error: any) {
    console.error('Create patient error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await patient.update(req.body);
    res.json(patient);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await patient.update({ isActive: false });
    res.json({ message: 'Patient deactivated successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

