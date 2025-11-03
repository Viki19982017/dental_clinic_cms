import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import '../styles/Common.css';

function Treatments() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      const data = await api.getTreatments();
      setTreatments(data);
    } catch (error) {
      console.error('Failed to load treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading treatments...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Treatments</h2>
      </div>

      <div className="card">
        {treatments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Dentist</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment.id}>
                    <td>{treatment.id}</td>
                    <td>
                      {treatment.patient?.firstName} {treatment.patient?.lastName}
                    </td>
                    <td>
                      Dr. {treatment.dentist?.firstName} {treatment.dentist?.lastName}
                    </td>
                    <td>{treatment.treatmentType}</td>
                    <td>{new Date(treatment.treatmentDate).toLocaleDateString()}</td>
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
          </div>
        ) : (
          <div className="empty-state">
            <p>No treatments found</p>
          </div>
        )}
      </div>
    </div>
  );
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

export default Treatments;

