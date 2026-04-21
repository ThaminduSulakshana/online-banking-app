import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { Card, Button, Input } from '../components/UI';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const TransfersPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    sourceAccountNumber: '',
    destinationAccountNumber: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchAccs = async () => {
      try {
        const data = await accountService.getMyAccounts(user.token);
        setAccounts(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, sourceAccountNumber: data[0].accountNumber }));
        }
      } catch (err) {}
    };
    fetchAccs();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await transactionService.transfer({
        ...formData,
        amount: parseFloat(formData.amount)
      }, user.token);
      
      setStatus({ type: 'success', message: 'Transfer completed successfully!' });
      setFormData({
        sourceAccountNumber: accounts[0]?.accountNumber || '',
        destinationAccountNumber: '',
        amount: '',
        description: ''
      });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Transfer failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '2rem' }}>Transfer Funds</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card title="Transfer Details" style={{ gridColumn: '1 / -1' }}>
          {status.message && (
            <div style={{ 
              backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: status.type === 'success' ? '#15803d' : '#b91c1c',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {status.message}
            </div>
          )}

          <form onSubmit={handleTransfer}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Select Source Account</label>
              <select 
                value={formData.sourceAccountNumber}
                onChange={(e) => setFormData({ ...formData, sourceAccountNumber: e.target.value })}
                style={{ 
                  width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)'
                }}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountType} (**** {acc.accountNumber.slice(-4)}) - ${acc.balance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <Input 
              label="Recipient Account Number"
              placeholder="Enter 10-digit account number"
              value={formData.destinationAccountNumber}
              onChange={(e) => setFormData({ ...formData, destinationAccountNumber: e.target.value })}
              required
            />

            <Input 
              label="Amount ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />

            <Input 
              label="Description (Optional)"
              placeholder="Rent, Groceries, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? <Loader2 className="animate-spin" style={{ marginRight: '0.5rem' }} size={18} /> : <Send size={18} style={{ marginRight: '0.5rem' }} />}
              Send Money Now
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransfersPage;
