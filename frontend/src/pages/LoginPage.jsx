import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/UI';
import { Lock, User as UserIcon, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e293b 100%)',
      padding: '1.5rem'
    }}>
      <Card style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: 'var(--accent-color)', 
            borderRadius: 'var(--radius-lg)', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <Lock size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-color)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Please enter your details to sign in</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          
          <Button 
            type="submit" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" style={{ marginRight: '0.5rem' }} size={18} />
                Signing in...
              </>
            ) : 'Sign In'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? {' '}
          <Link to="/register" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>
            Register Now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
