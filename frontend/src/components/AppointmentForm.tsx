import { useState, FormEvent, useEffect } from 'react';
import { api } from '../utils/api';

interface AppointmentFormProps {
  appointment: any;
  onClose: () => void;
  onSave: () => void;
}

function AppointmentForm({ appointment, onClose, onSave }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    dentistId: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: 30,
    appointmentType: 'Checkup',
    status: 'Scheduled',
    reason: '',
    notes: ''
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [dentists, setDentists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
    loadDentists();

    if (appointment) {
      setFormData({
        ...appointment,
        patientId: appointment.patientId.toString(),
        dentistId: appointment.dentistId.toString(),
        appointmentDate: appointment.appointmentDate
      });
    }
  }, [appointment]);

  const loadPatients = async () => {
    try {
      const data = await api.getPatients({ limit: 1000 });
      setPatients(data.patients);
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const loadDentists = async () => {
    try {
      const data = await api.getDentists();
      setDentists(data);
    } catch (error) {
      console.error('Failed to load dentists:', error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        patientId: parseInt(formData.patientId),
        dentistId: parseInt(formData.dentistId),
        duration: parseInt(formData.duration.toString())
      };

      if (appointment) {
        await api.updateAppointment(appointment.id, submitData);
      } else {
        await api.createAppointment(submitData);
      }
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Patient *</label>
              <select
                name="patientId"
                className="form-select"
                value={formData.patientId}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dentist *</label>
              <select
                name="dentistId"
                className="form-select"
                value={formData.dentistId}
                onChange={handleChange}
                required
              >
                <option value="">Select Dentist</option>
                {dentists.map(dentist => (
                  <option key={dentist.id} value={dentist.id}>
                    Dr. {dentist.firstName} {dentist.lastName} 
                    {dentist.specialization && ` - ${dentist.specialization}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="appointmentDate"
                  className="form-input"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time *</label>
                <input
                  type="time"
                  name="appointmentTime"
                  className="form-input"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Duration (minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  className="form-input"
                  value={formData.duration}
                  onChange={handleChange}
                  min="15"
                  step="15"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type *</label>
                <select
                  name="appointmentType"
                  className="form-select"
                  value={formData.appointmentType}
                  onChange={handleChange}
                  required
                >
                  <option value="Checkup">Checkup</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Filling">Filling</option>
                  <option value="Root Canal">Root Canal</option>
                  <option value="Extraction">Extraction</option>
                  <option value="Orthodontics">Orthodontics</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Visit *</label>
              <input
                type="text"
                name="reason"
                className="form-input"
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g., Tooth pain, Regular checkup"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                className="form-textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm;

