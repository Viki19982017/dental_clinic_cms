import { Request, Response } from 'express';
import { Staff } from '../models';

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const { role, isActive = true } = req.query;
    const whereClause: any = { isActive };

    if (role) {
      whereClause.role = role;
    }

    const staff = await Staff.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.create(req.body);
    const { password, ...staffData } = staff.toJSON();
    res.status(201).json(staffData);
  } catch (error: any) {
    console.error('Create staff error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    await staff.update(req.body);
    const { password, ...staffData } = staff.toJSON();
    res.json(staffData);
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    await staff.update({ isActive: false });
    res.json({ message: 'Staff deactivated successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDentists = async (req: Request, res: Response) => {
  try {
    const dentists = await Staff.findAll({
      where: {
        role: 'Dentist',
        isActive: true
      },
      attributes: ['id', 'firstName', 'lastName', 'specialization', 'photo']
    });

    res.json(dentists);
  } catch (error) {
    console.error('Get dentists error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

