import { Request, Response } from 'express';
import { Patient, Appointment, Treatment, Invoice } from '../models';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import { getOrSetCache, CacheKeys } from '../utils/cache';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const cacheKey = CacheKeys.dashboardStats();

    // Use cache with 5 minutes expiration
    const stats = await getOrSetCache(
      cacheKey,
      async () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Total patients
        const totalPatients = await Patient.count({ where: { isActive: true } });

        // Today's appointments
        const todayAppointments = await Appointment.count({
          where: {
            appointmentDate: today.toISOString().split('T')[0]
          }
        });

        // This month's revenue
        const monthlyRevenue = await Invoice.sum('paidAmount', {
          where: {
            invoiceDate: {
              [Op.between]: [startOfMonth, endOfMonth]
            }
          }
        });

        // Pending payments
        const pendingPayments = await Invoice.sum('balanceAmount', {
          where: {
            paymentStatus: {
              [Op.in]: ['Pending', 'Partially Paid', 'Overdue']
            }
          }
        });

        // Recent appointments
        const recentAppointments = await Appointment.findAll({
          limit: 5,
          include: [
            { model: Patient, as: 'patient', attributes: ['firstName', 'lastName'] }
          ],
          order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']]
        });

        // Appointment status distribution
        const appointmentsByStatus = await Appointment.findAll({
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('status')), 'count']
          ],
          where: {
            appointmentDate: {
              [Op.gte]: today.toISOString().split('T')[0]
            }
          },
          group: ['status'],
          raw: true
        });

        return {
          totalPatients,
          todayAppointments,
          monthlyRevenue: monthlyRevenue || 0,
          pendingPayments: pendingPayments || 0,
          recentAppointments,
          appointmentsByStatus
        };
      },
      300 // 5 minutes cache
    );

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
