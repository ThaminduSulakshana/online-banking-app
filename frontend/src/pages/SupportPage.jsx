import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supportService } from '../services/supportService';
import { Card, Button, Input } from '../components/UI';
import { LifeBuoy, Send } from 'lucide-react';

const SupportPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ subject: '', description: '' });
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      const data = await supportService.getMyTickets(user.token);
      setTickets(data);
    } catch (err) {}
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supportService.createTicket(formData, user.token);
      setFormData({ subject: '', description: '' });
      fetchTickets();
    } catch (err) {} finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '2rem' }}>Customer Support</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card title="New Support Ticket">
          <form onSubmit={handleSubmit}>
            <Input label="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '120px' }}
                required
              />
            </div>
            <Button type="submit" disabled={loading} style={{ width: '100%' }}>Send Ticket</Button>
          </form>
        </Card>

        <Card title="My Tickets">
          {tickets.length === 0 ? <p color="var(--text-muted)">No tickets found.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tickets.map(t => (
                <div key={t.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{t.subject}</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{t.status}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{t.description}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
