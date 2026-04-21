const API_URL = '/api/auth';

export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Server Error: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (data.token) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  register: async (signupData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Server Error: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};
