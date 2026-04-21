export const transactionService = {
  transfer: async (transferData, token) => {
    const response = await fetch('/api/transactions/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transferData)
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
      throw new Error(data.message || 'Transfer failed');
    }
    return data;
  },

  getHistory: async (accountNumber, token) => {
    const response = await fetch(`/api/transactions/history/${accountNumber}`, {
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
      throw new Error(data.message || 'Failed to fetch transaction history');
    }
    return data;
  }
};
