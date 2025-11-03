import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import '../styles/Staff.css';

function Staff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    loadStaff();
  }, [filterRole]);

  const loadStaff = async () => {
    try {
      const params = filterRole ? { role: filterRole } : {};
      const data = await api.getStaff(params);
      setStaff(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading staff...</div>;
  }

  return (
    <div className="staff-page">
      <div className="page-header">
        <div className="filters">
          <select
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Dentist">Dentist</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Hygienist">Hygienist</option>
            <option value="Assistant">Assistant</option>
          </select>
        </div>
      </div>

      {staff.length > 0 ? (
        <div className="staff-grid">
          {staff.map((member) => (
            <div key={member.id} className="staff-card card">
              <div className="staff-avatar">
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div className="staff-info">
                <h3 className="staff-name">
                  {member.role === 'Dentist' ? 'Dr. ' : ''}
                  {member.firstName} {member.lastName}
                </h3>
                <span className={`badge badge-${getRoleBadgeColor(member.role)}`}>
                  {member.role}
                </span>
                {member.specialization && (
                  <p className="staff-specialization">{member.specialization}</p>
                )}
                <div className="staff-contact">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span>{member.email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <span>{member.phone}</span>
                  </div>
                  {member.licenseNumber && (
                    <div className="contact-item">
                      <span className="contact-icon">🎫</span>
                      <span>License: {member.licenseNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <p>No staff members found</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getRoleBadgeColor(role: string): string {
  const colors: { [key: string]: string } = {
    'Admin': 'danger',
    'Dentist': 'success',
    'Receptionist': 'info',
    'Hygienist': 'warning',
    'Assistant': 'secondary'
  };
  return colors[role] || 'secondary';
}

export default Staff;

