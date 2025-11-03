import { Request, Response } from 'express';
import { Treatment, Patient, Staff, Appointment } from '../models';

export const getAllTreatments = async (req: Request, res: Response) => {
  try {
    const { patientId, dentistId, status } = req.query;
    const whereClause: any = {};

    if (patientId) {
      whereClause.patientId = patientId;
    }
    if (dentistId) {
      whereClause.dentistId = dentistId;
    }
    if (status) {
      whereClause.status = status;
    }

    const treatments = await Treatment.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Staff, as: 'dentist', attributes: ['id', 'firstName', 'lastName'] },
        { model: Appointment, as: 'appointment' }
      ],
      order: [['treatmentDate', 'DESC']]
    });

    res.json(treatments);
  } catch (error) {
    console.error('Get treatments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTreatmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const treatment = await Treatment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Staff, as: 'dentist' },
        { model: Appointment, as: 'appointment' }
      ]
    });

    if (!treatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }

    res.json(treatment);
  } catch (error) {
    console.error('Get treatment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTreatment = async (req: Request, res: Response) => {
  try {
    const treatment = await Treatment.create(req.body);
    const fullTreatment = await Treatment.findByPk(treatment.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Staff, as: 'dentist' }
      ]
    });
    res.status(201).json(fullTreatment);
  } catch (error) {
    console.error('Create treatment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTreatment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const treatment = await Treatment.findByPk(id);

    if (!treatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }

    await treatment.update(req.body);
    const updatedTreatment = await Treatment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Staff, as: 'dentist' }
      ]
    });
    res.json(updatedTreatment);
  } catch (error) {
    console.error('Update treatment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTreatment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const treatment = await Treatment.findByPk(id);

    if (!treatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }

    await treatment.destroy();
    res.json({ message: 'Treatment deleted successfully' });
  } catch (error) {
    console.error('Delete treatment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

