export const loanService = {
  getMyLoans: async (token) => {
    const response = await fetch('/api/loans/my-loans', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch loans');
    return response.json();
  },
  apply: async (loanData, token) => {
    const response = await fetch('/api/loans/apply', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loanData),
    });
    if (!response.ok) throw new Error('Failed to apply for loan');
    return response.json();
  }
};
