import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import '../styles/Dashboard.css';

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  pendingPayments: number;
  recentAppointments: any[];
  appointmentsByStatus: any[];
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats?.totalPatients || 0}</h3>
            <p className="stat-label">Total Patients</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats?.todayAppointments || 0}</h3>
            <p className="stat-label">Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-value">${stats?.monthlyRevenue?.toFixed(2) || '0.00'}</h3>
            <p className="stat-label">Monthly Revenue</p>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3 className="stat-value">${stats?.pendingPayments?.toFixed(2) || '0.00'}</h3>
            <p className="stat-label">Pending Payments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Appointments</h3>
            <Link to="/appointments" className="btn btn-sm btn-outline">
              View All
            </Link>
          </div>
          {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((appointment: any) => (
                    <tr key={appointment.id}>
                      <td>
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </td>
                      <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                      <td>{appointment.appointmentTime}</td>
                      <td>{appointment.appointmentType}</td>
                      <td>
                        <span className={`badge badge-${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-light">No recent appointments</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/appointments" className="quick-action-card">
              <span className="quick-action-icon">📅</span>
              <h4>New Appointment</h4>
              <p>Schedule a patient appointment</p>
            </Link>
            <Link to="/patients" className="quick-action-card">
              <span className="quick-action-icon">👤</span>
              <h4>Add Patient</h4>
              <p>Register a new patient</p>
            </Link>
            <Link to="/treatments" className="quick-action-card">
              <span className="quick-action-icon">🦷</span>
              <h4>New Treatment</h4>
              <p>Record a treatment</p>
            </Link>
            <Link to="/invoices" className="quick-action-card">
              <span className="quick-action-icon">💰</span>
              <h4>Create Invoice</h4>
              <p>Generate new invoice</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    'Scheduled': 'info',
    'Confirmed': 'success',
    'In Progress': 'warning',
    'Completed': 'success',
    'Cancelled': 'danger',
    'No Show': 'danger'
  };
  return colors[status] || 'secondary';
}

export default Dashboard;

