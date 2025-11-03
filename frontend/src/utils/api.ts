const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Patients
  getPatients: async (params?: any) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/patients?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getPatient: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createPatient: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updatePatient: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deletePatient: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Appointments
  getAppointments: async (params?: any) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/appointments?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getTodayAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/today`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getAppointment: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createAppointment: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateAppointment: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteAppointment: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Treatments
  getTreatments: async (params?: any) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/treatments?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createTreatment: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/treatments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateTreatment: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/treatments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Invoices
  getInvoices: async (params?: any) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/invoices?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createInvoice: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateInvoice: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Staff
  getStaff: async (params?: any) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/staff?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getDentists: async () => {
    const response = await fetch(`${API_BASE_URL}/staff/dentists`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createStaff: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateStaff: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

