import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import PatientForm from '../components/PatientForm.tsx';
import '../styles/Patients.css';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPatients();
  }, [searchTerm, currentPage]);

  const loadPatients = async () => {
    try {
      const data = await api.getPatients({ search: searchTerm, page: currentPage, limit: 10 });
      setPatients(data.patients);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowModal(true);
  };

  const handleSavePatient = async () => {
    setShowModal(false);
    setEditingPatient(null);
    await loadPatients();
  };

  const handleDeletePatient = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.deletePatient(id);
        await loadPatients();
      } catch (error) {
        console.error('Failed to delete patient:', error);
      }
    }
  };

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

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="patients-page">
      <div className="page-header">
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <button onClick={handleAddPatient} className="btn btn-primary">
          + Add Patient
        </button>
      </div>

      <div className="card">
        {patients.length > 0 ? (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>
                        <Link to={`/patients/${patient.id}`} className="patient-link">
                          {patient.firstName} {patient.lastName}
                        </Link>
                      </td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{calculateAge(patient.dateOfBirth)}</td>
                      <td>{patient.gender}</td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/patients/${patient.id}`} className="btn btn-sm btn-outline">
                            View
                          </Link>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
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

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No patients found</p>
            <button onClick={handleAddPatient} className="btn btn-primary">
              Add Your First Patient
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <PatientForm
          patient={editingPatient}
          onClose={() => setShowModal(false)}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
}

export default Patients;

