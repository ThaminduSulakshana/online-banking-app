import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loanService } from '../services/loanService';
import { Card, Button, Input } from '../components/UI';
import { HandCoins, Plus, CheckCircle2, History } from 'lucide-react';

const LoansPage = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({ amount: '', termMonths: '12' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchLoans = async () => {
    try {
      const data = await loanService.getMyLoans(user.token);
      setLoans(data);
    } catch (err) {}
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loanService.apply({ amount: parseFloat(formData.amount), termMonths: parseInt(formData.termMonths) }, user.token);
      setMessage({ type: 'success', text: 'Loan application submitted!' });
      setFormData({ amount: '', termMonths: '12' });
      fetchLoans();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '2rem' }}>Loan Center</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card title="Apply for a Loan">
          {message && <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', background: message.type === 'success' ? '#dcfce7' : '#fee2e2' }}>{message.text}</div>}
          <form onSubmit={handleApply}>
            <Input label="Desired Amount ($)" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            <Input label="Term (Months)" type="number" value={formData.termMonths} onChange={e => setFormData({...formData, termMonths: e.target.value})} required />
            <Button type="submit" disabled={loading} style={{ width: '100%' }}>Submit Application</Button>
          </form>
        </Card>

        <Card title="Loan History">
          {loans.length === 0 ? <p color="var(--text-muted)">No loans yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loans.map(loan => (
                <div key={loan.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>${loan.amount}</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: loan.status === 'PENDING' ? 'var(--warning-color)' : 'var(--success-color)' }}>{loan.status}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{loan.termMonths} Months @ {loan.interestRate}%</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoansPage;
