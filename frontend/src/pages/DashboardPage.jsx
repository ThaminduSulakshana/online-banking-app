import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { Card, Button } from '../components/UI';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  Plus,
  RefreshCw,
  ArrowRightLeft
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const accs = await accountService.getMyAccounts(user.token);
      setAccounts(accs);
      
      if (accs.length > 0) {
        const history = await transactionService.getHistory(accs[0].accountNumber, user.token);
        setRecentTransactions(history.slice(0, 5));
      }
    } catch (err) {
      setError('Could not update account info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--primary-color)' }}>Welcome back, {user?.username}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Your financial overview is ready for review.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw size={16} style={{ marginRight: '0.5rem' }} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button variant="accent" size="sm" onClick={() => window.location.href='/accounts'}>
            <Plus size={16} style={{ marginRight: '0.5rem' }} />
            New Account
          </Button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' 
      }}>
        <Card style={{ 
          background: 'linear-gradient(135deg, var(--accent-color) 0%, #1d4ed8 100%)', 
          color: 'white', border: 'none'
        }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Total Balance</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0' }}>{totalBalance}</h2>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#bbf7d0' }}>
            <TrendingUp size={16} style={{ marginRight: '0.25rem' }} />
            <span>Active Portfolio</span>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loans</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>$0.00</h2>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '12px', color: 'var(--accent-color)', height: 'fit-content' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Transactions</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>{recentTransactions.length}</h2>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '12px', color: 'var(--primary-color)', height: 'fit-content' }}>
              <ArrowRightLeft size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Active Accounts</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {accounts.map(acc => (
              <Card key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px' }}><DollarSign size={20} /></div>
                  <div>
                    <h4 style={{ fontWeight: '600' }}>{acc.accountType}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>**** {acc.accountNumber.slice(-4)}</p>
                  </div>
                </div>
                <h3 style={{ fontWeight: '700' }}>${acc.balance.toFixed(2)}</h3>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Activity</h2>
          <Card>
            {recentTransactions.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent transactions.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentTransactions.map(tx => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <div>
                      <p style={{ fontWeight: '500' }}>{tx.description || 'Transfer'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                    <p style={{ fontWeight: '600', color: tx.amount > 0 ? 'var(--success-color)' : 'var(--text-main)' }}>
                      ${tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
