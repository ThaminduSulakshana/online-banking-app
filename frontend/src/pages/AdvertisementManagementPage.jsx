import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { advertisementService } from '../services/advertisementService';
import { Card, Button } from '../components/UI';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdvertisementManagementPage = () => {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentAd, setCurrentAd] = useState({ title: '', content: '', imageUrl: '', active: true });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const allAds = await advertisementService.getAllAds(user.token);
      setAds(allAds);
    } catch (err) {
      setError('Could not fetch advertisements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAd({
      ...currentAd,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentAd.id) {
        await advertisementService.updateAd(currentAd.id, currentAd, user.token);
      } else {
        await advertisementService.createAd(currentAd, user.token);
      }
      setIsEditing(false);
      setCurrentAd({ title: '', content: '', imageUrl: '', active: true });
      fetchAds();
    } catch (err) {
      alert('Error saving advertisement. Please check your data.');
    }
  };

  const handleEdit = (ad) => {
    setIsEditing(true);
    setCurrentAd({ ...ad, active: ad.isActive }); // Transform backend isActive to active state model if needed.
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await advertisementService.deleteAd(id, user.token);
        fetchAds();
      } catch (err) {
        alert('Error deleting advertisement.');
      }
    }
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentAd({ title: '', content: '', imageUrl: '', active: true });
  }

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentAd({ title: '', content: '', imageUrl: '', active: true });
  }

  const formStyle = {
    display: 'flex', flexDirection: 'column', gap: '1rem',
    background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)', marginBottom: '2rem'
  };
  const inputStyle = {
    padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)',
    background: 'var(--bg-color)', color: 'var(--text-main)', width: '100%', fontSize: '0.875rem'
  };
  const labelStyle = { 
    fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block', color: 'var(--text-main)' 
  };

  if (loading && ads.length === 0) return <p>Loading advertisements...</p>;

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--primary-color)' }}>Advertisement Management</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Create and manage app advertisements.</p>
        </div>
        {!isEditing && (
          <Button variant="accent" onClick={handleAddNew}>
            <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add Advertisement
          </Button>
        )}
      </div>

      {error && <p style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</p>}

      {isEditing && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{currentAd.id ? 'Edit Advertisement' : 'New Advertisement'}</h2>
          
          <div>
            <label style={labelStyle}>Title</label>
            <input name="title" value={currentAd.title} onChange={handleChange} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Content</label>
            <textarea name="content" value={currentAd.content} onChange={handleChange} style={{...inputStyle, minHeight: '100px'}} required />
          </div>

          <div>
            <label style={labelStyle}>Image URL</label>
            <input type="url" name="imageUrl" value={currentAd.imageUrl} onChange={handleChange} style={inputStyle} required />
            {currentAd.imageUrl && (
               <img src={currentAd.imageUrl} alt="preview" style={{ maxHeight: '100px', marginTop: '0.5rem', borderRadius: '4px' }} />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="active" name="active" checked={currentAd.active} onChange={handleChange} />
            <label htmlFor="active" style={{ fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer' }}>Is Active</label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button type="submit" variant="primary">Save Advertisement</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </form>
      )}

      {!isEditing && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {ads.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No advertisements found.</p>
          ) : (
            ads.map(ad => (
              <Card key={ad.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={ad.imageUrl} 
                  alt={ad.title} 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>{ad.title}</h3>
                    {ad.isActive ? <CheckCircle size={20} color="var(--success-color)" /> : <XCircle size={20} color="var(--text-muted)" />}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ad.content}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(ad.id)} style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdvertisementManagementPage;
