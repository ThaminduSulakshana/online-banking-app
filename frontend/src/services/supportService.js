export const supportService = {
  getMyTickets: async (token) => {
    const response = await fetch('/api/support/my-tickets', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
  },
  createTicket: async (ticketData, token) => {
    const response = await fetch('/api/support/create', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    return response.json();
  }
};
