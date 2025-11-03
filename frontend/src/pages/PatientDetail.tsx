import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import '../styles/PatientDetail.css';

function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const data = await api.getPatient(Number(id));
      setPatient(data);
    } catch (error) {
      console.error('Failed to load patient:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading patient details...</div>;
  }

  if (!patient) {
    return <div className="alert alert-error">Patient not found</div>;
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="patient-detail">
      <div className="detail-header">
        <div className="header-left">
          <Link to="/patients" className="back-link">← Back to Patients</Link>
          <h2 className="patient-name">{patient.firstName} {patient.lastName}</h2>
        </div>
      </div>

      <div className="patient-info-card card">
        <div className="patient-avatar">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div className="patient-basic-info">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{patient.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <span className="info-value">{patient.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Age:</span>
            <span className="info-value">{calculateAge(patient.dateOfBirth)} years</span>
          </div>
          <div className="info-item">
            <span className="info-label">Gender:</span>
            <span className="info-value">{patient.gender}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Personal Info
        </button>
        <button
          className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments ({patient.appointments?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'treatments' ? 'active' : ''}`}
          onClick={() => setActiveTab('treatments')}
        >
          Treatments ({patient.treatments?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices ({patient.invoices?.length || 0})
        </button>
      </div>

      <div className="tab-content card">
        {activeTab === 'info' && (
          <div className="grid grid-2">
            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="info-item">
                <span className="info-label">Address:</span>
                <span className="info-value">{patient.address}</span>
              </div>
              <div className="info-item">
                <span className="info-label">City:</span>
                <span className="info-value">{patient.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">State:</span>
                <span className="info-value">{patient.state}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Zip Code:</span>
                <span className="info-value">{patient.zipCode}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Emergency Contact</h3>
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{patient.emergencyContactName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{patient.emergencyContactPhone}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Insurance Information</h3>
              <div className="info-item">
                <span className="info-label">Provider:</span>
                <span className="info-value">{patient.insuranceProvider || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Policy Number:</span>
                <span className="info-value">{patient.insurancePolicyNumber || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Medical Information</h3>
              <div className="info-item">
                <span className="info-label">Blood Group:</span>
                <span className="info-value">{patient.bloodGroup || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Allergies:</span>
                <span className="info-value">{patient.allergies || 'None'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Medical History:</span>
                <span className="info-value">{patient.medicalHistory || 'None'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            {patient.appointments && patient.appointments.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.appointments.map((appointment: any) => (
                    <tr key={appointment.id}>
                      <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                      <td>{appointment.appointmentTime}</td>
                      <td>{appointment.appointmentType}</td>
                      <td>
                        <span className={`badge badge-${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>{appointment.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-light">No appointments found</p>
            )}
          </div>
        )}

        {activeTab === 'treatments' && (
          <div>
            {patient.treatments && patient.treatments.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Diagnosis</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.treatments.map((treatment: any) => (
                    <tr key={treatment.id}>
                      <td>{new Date(treatment.treatmentDate).toLocaleDateString()}</td>
                      <td>{treatment.treatmentType}</td>
                      <td>{treatment.diagnosis}</td>
                      <td>${treatment.cost}</td>
                      <td>
                        <span className={`badge badge-${getTreatmentStatusColor(treatment.status)}`}>
                          {treatment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-light">No treatments found</p>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            {patient.invoices && patient.invoices.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.invoices.map((invoice: any) => (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                      <td>${invoice.totalAmount}</td>
                      <td>${invoice.paidAmount}</td>
                      <td>${invoice.balanceAmount}</td>
                      <td>
                        <span className={`badge badge-${getPaymentStatusColor(invoice.paymentStatus)}`}>
                          {invoice.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-light">No invoices found</p>
            )}
          </div>
        )}
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

function getTreatmentStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    'Planned': 'info',
    'In Progress': 'warning',
    'Completed': 'success',
    'Cancelled': 'danger'
  };
  return colors[status] || 'secondary';
}

function getPaymentStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    'Pending': 'warning',
    'Partially Paid': 'info',
    'Paid': 'success',
    'Overdue': 'danger',
    'Cancelled': 'secondary'
  };
  return colors[status] || 'secondary';
}

export default PatientDetail;

