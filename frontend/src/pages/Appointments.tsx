import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import AppointmentForm from '../components/AppointmentForm.tsx';
import '../styles/Appointments.css';

function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadAppointments();
  }, [filterDate, filterStatus]);

  const loadAppointments = async () => {
    try {
      const params: any = {};
      if (filterDate) params.date = filterDate;
      if (filterStatus) params.status = filterStatus;

      const data = await api.getAppointments(params);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setShowModal(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowModal(true);
  };

  const handleSaveAppointment = async () => {
    setShowModal(false);
    setEditingAppointment(null);
    await loadAppointments();
  };

  const handleDeleteAppointment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.deleteAppointment(id);
        await loadAppointments();
      } catch (error) {
        console.error('Failed to delete appointment:', error);
      }
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await api.updateAppointment(id, { status });
      await loadAppointments();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="filters">
          <input
            type="date"
            className="form-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Filter by date"
          />
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No Show">No Show</option>
          </select>
        </div>
        <button onClick={handleAddAppointment} className="btn btn-primary">
          + New Appointment
        </button>
      </div>

      <div className="card">
        {appointments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Dentist</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </td>
                    <td>
                      Dr. {appointment.dentist?.firstName} {appointment.dentist?.lastName}
                    </td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>{appointment.appointmentType}</td>
                    <td>
                      <select
                        className={`status-select status-${getStatusColor(appointment.status)}`}
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No Show">No Show</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No appointments found</p>
            <button onClick={handleAddAppointment} className="btn btn-primary">
              Schedule Your First Appointment
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <AppointmentForm
          appointment={editingAppointment}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAppointment}
        />
      )}
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

export default Appointments;

