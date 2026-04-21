export const accountService = {
  getMyAccounts: async (token) => {
    const response = await fetch('/api/accounts/my-accounts', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
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
        throw new Error(data.message || 'Failed to fetch accounts');
    }
    return data;
  },

  createAccount: async (accData, token) => {
    const response = await fetch('/api/accounts/create', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accData)
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
        throw new Error(data.message || 'Failed to create account');
    }
    return data;
  }
};
