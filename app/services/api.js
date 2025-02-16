// services/api.js

const API_BASE_URL = 'https://clinic-backend-f42a.onrender.com';

export const fetchDoctors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`,{
        method:'GET',
        credentials:'include'
    });
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const fetchAppointments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`,{
        method:'GET',
        credentials: 'include'
  });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (id, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};