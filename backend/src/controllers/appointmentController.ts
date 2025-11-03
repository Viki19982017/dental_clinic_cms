import { Request, Response } from 'express';
import { Appointment, Patient, Staff } from '../models';
import { Op } from 'sequelize';

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const { date, dentistId, patientId, status } = req.query;
    const whereClause: any = {};

    if (date) {
      whereClause.appointmentDate = date;
    }
    if (dentistId) {
      whereClause.dentistId = dentistId;
    }
    if (patientId) {
      whereClause.patientId = patientId;
    }
    if (status) {
      whereClause.status = status;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'phone'] },
        { model: Staff, as: 'dentist', attributes: ['id', 'firstName', 'lastName', 'specialization'] }
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Staff, as: 'dentist' }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.create(req.body);
    const fullAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Staff, as: 'dentist' }
      ]
    });
    res.status(201).json(fullAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.update(req.body);
    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Staff, as: 'dentist' }
      ]
    });
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTodayAppointments = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const appointments = await Appointment.findAll({
      where: {
        appointmentDate: today
      },
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'phone'] },
        { model: Staff, as: 'dentist', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['appointmentTime', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

