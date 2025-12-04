const BASE_URL = 'http://localhost:8000/api';

export const api = {
  getToken: () => localStorage.getItem('token'),

  login: async (username, password) => {
    try {
      console.log('Attempting login with:', username);
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        console.error('Login error data:', data);
        const detail = (data && (data.detail || data.non_field_errors?.[0])) || 'Error al iniciar sesión';
        throw new Error(detail);
      }

      console.log('Login success data:', data);
      if (data.access) {
        localStorage.setItem('token', data.access);
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error) {
      console.error('Login exception:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('Attempting register with:', userData);
      const response = await fetch(`${BASE_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Register response status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        console.error('Register error data:', data);
        const detail = (data && (data.detail || JSON.stringify(data))) || 'Error al registrarse';
        throw new Error(detail);
      }

      console.log('Register success data:', data);
      if (data.access) {
        console.log('Saving token to localStorage:', data.access);
        localStorage.setItem('token', data.access);
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        console.error('No access token in register response:', data);
      }
      return data;
    } catch (error) {
      console.error('Register exception:', error);
      throw error;
    }
  },

  uploadDNI: async (dniFront, dniBack) => {
    const token = localStorage.getItem('token');
    console.log('uploadDNI reading token:', token);
    if (!token) throw new Error('No authentication token found');

    const formData = new FormData();
    formData.append('dni_frente', dniFront);
    formData.append('dni_dorso', dniBack);

    try {
      const response = await fetch(`${BASE_URL}/auth/kyc/dni/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error uploading DNI');
      }

      return await response.json();
    } catch (error) {
      console.error('DNI Upload error:', error);
      throw error;
    }
  },

  getAccount: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    try {
      const response = await fetch(`${BASE_URL}/cuentas/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching account');
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Get Account error:', error);
      throw error;
    }
  },

  getTransactions: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    try {
      const response = await fetch(`${BASE_URL}/movimientos/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Get Transactions error:', error);
      throw error;
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: async () => {
    // Try to get from localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // If not, try to fetch using ID from token
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Simple JWT decode
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id;

      const response = await fetch(`${BASE_URL}/usuarios/${userId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    return null;
  },

  getProfilePicture: (userId) => {
    return localStorage.getItem(`profile_picture_${userId}`);
  },

  setProfilePicture: (userId, base64Image) => {
    localStorage.setItem(`profile_picture_${userId}`, base64Image);
  }
};
