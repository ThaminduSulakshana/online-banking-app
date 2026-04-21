const API_URL = '/api/advertisements';

export const advertisementService = {
  getActiveAds: async (token) => {
    const response = await fetch(`${API_URL}/active`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch active advertisements');
    }
    return response.json();
  },

  getAllAds: async (token) => {
    const response = await fetch(`${API_URL}/all`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch advertisements');
    }
    return response.json();
  },

  createAd: async (adData, token) => {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adData),
    });
    if (!response.ok) {
       throw new Error('Failed to create advertisement');
    }
    return response.json();
  },

  updateAd: async (id, adData, token) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adData),
    });
    if (!response.ok) {
       throw new Error('Failed to update advertisement');
    }
    return response.json();
  },

  deleteAd: async (id, token) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
       throw new Error('Failed to delete advertisement');
    }
    return response.json();
  }
};
