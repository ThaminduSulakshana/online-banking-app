import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button, Input, Card } from '../components/UI';
import { UserPlus, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: [] // default Customer
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            backgroundColor: 'var(--success-color)', 
            borderRadius: 'var(--radius-lg)', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <UserPlus size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-color)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Join our secure banking platform</p>
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

        {success && (
          <div style={{ 
            backgroundColor: '#dcfce7', 
            color: '#15803d', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            border: '1px solid #bbf7d0'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Username"
            name="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input 
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input 
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input 
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <Button 
            type="submit" 
            variant="accent"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" style={{ marginRight: '0.5rem' }} size={18} />
                Creating account...
              </>
            ) : 'Create Account'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? {' '}
          <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
