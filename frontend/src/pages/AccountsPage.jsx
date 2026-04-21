import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountService } from '../services/accountService';
import { Card, Button, Input } from '../components/UI';
import { Wallet, Plus, CreditCard } from 'lucide-react';

const AccountsPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ accountType: 'SAVINGS', initialBalance: '1000' });

  const fetchAccounts = async () => {
    try {
      const data = await accountService.getMyAccounts(user.token);
      setAccounts(data);
    } catch (err) {}
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await accountService.createAccount({ 
        accountType: formData.accountType, 
        balance: parseFloat(formData.initialBalance) 
      }, user.token);
      setShowAdd(false);
      fetchAccounts();
    } catch (err) {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--primary-color)' }}>Your Accounts</h1>
        <Button variant="accent" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          New Account
        </Button>
      </div>

      {showAdd && (
        <Card title="Open New Account" style={{ marginBottom: '2rem', maxWidth: '500px' }}>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Account Type</label>
              <select 
                value={formData.accountType}
                onChange={e => setFormData({...formData, accountType: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              >
                <option value="SAVINGS">Savings Account</option>
                <option value="CHECKING">Checking Account</option>
              </select>
            </div>
            <Input label="Initial Deposit ($)" type="number" value={formData.initialBalance} onChange={e => setFormData({...formData, initialBalance: e.target.value})} required />
            <Button type="submit" style={{ width: '100%' }}>Open Account</Button>
          </form>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {accounts.map(acc => (
          <Card key={acc.id}>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '12px', color: 'var(--accent-color)' }}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600' }}>{acc.accountType}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>**** {acc.accountNumber.slice(-4)}</p>
                </div>
             </div>
             <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>${acc.balance.toFixed(2)}</h2>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Current Balance</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;
