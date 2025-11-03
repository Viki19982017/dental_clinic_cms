import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import '../styles/Common.css';

function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadInvoices();
  }, [filterStatus]);

  const loadInvoices = async () => {
    try {
      const params = filterStatus ? { paymentStatus: filterStatus } : {};
      const data = await api.getInvoices(params);
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="filters">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Payment Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card">
        {invoices.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td><strong>{invoice.invoiceNumber}</strong></td>
                    <td>
                      {invoice.patient?.firstName} {invoice.patient?.lastName}
                    </td>
                    <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td>${parseFloat(invoice.totalAmount).toFixed(2)}</td>
                    <td>${parseFloat(invoice.paidAmount).toFixed(2)}</td>
                    <td>${parseFloat(invoice.balanceAmount).toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${getPaymentStatusColor(invoice.paymentStatus)}`}>
                        {invoice.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
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

export default Invoices;

