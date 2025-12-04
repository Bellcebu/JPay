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
      if (data.token) {
        localStorage.setItem('token', data.token);
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
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Register exception:', error);
      throw error;
    }
  },

  uploadDNI: async (dniFront, dniBack) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const formData = new FormData();
    formData.append('dni_frente', dniFront);
    formData.append('dni_dorso', dniBack);

    try {
      const response = await fetch(`${BASE_URL}/auth/kyc/dni/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
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

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('token');
  }
};
