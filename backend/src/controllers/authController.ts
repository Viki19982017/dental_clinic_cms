import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Staff } from '../models';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const staff = await Staff.findOne({ where: { email, isActive: true } });

    if (!staff) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await staff.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: staff.id, email: staff.email, role: staff.role },
      (process.env.JWT_SECRET || 'your_jwt_secret') as Secret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' } as SignOptions
    );

    res.json({
      token,
      user: {
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role,
        photo: staff.photo
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!staff) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

