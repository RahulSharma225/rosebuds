import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/contacts' + (filter ? `?status=${filter}` : ''))
      .then(({ data }) => setContacts(data.contacts || []))
      .catch(() => toast.error('Failed to load contacts'))
      .finally(() => setLoading(false));
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/contacts/${id}/status`, { status });
      setContacts(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const STATUS_COLOR = { new:'#e8355a', read:'#3b82f6', replied:'#22c55e', closed:'#9ca3af' };

  return (
    <AdminLayout title="Enquiries & Contact Messages">
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {['','new','read','replied','closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding:'.5rem 1.2rem', borderRadius:100, border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontWeight:600, fontSize:'.85rem', background: filter===s ? '#e8355a' : 'white', color: filter===s ? 'white' : '#7a5a64', boxShadow:'0 2px 8px rgba(200,40,70,0.08)' }}>
            {s ? s.charAt(0).toUpperCase()+s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color:'#7a5a64' }}>Loading...</p> : contacts.length === 0 ? (
        <div style={{ textAlign:'center', background:'white', borderRadius:20, padding:'3rem', color:'#7a5a64' }}>No enquiries found.</div>
      ) : contacts.map(c => (
        <div key={c._id} style={{ background:'white', borderRadius:16, padding:'1.5rem', marginBottom:'1rem', boxShadow:'0 4px 16px rgba(200,40,70,0.06)', border:'1px solid rgba(232,53,90,0.08)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
            <div>
              <div style={{ fontWeight:700, color:'#1a0a10', fontSize:'1rem' }}>{c.name}</div>
              <div style={{ fontSize:'.83rem', color:'#7a5a64' }}>{c.email} {c.phone && `· ${c.phone}`}</div>
              <div style={{ fontSize:'.8rem', color:'#7a5a64', marginTop:'.2rem' }}>{new Date(c.createdAt).toLocaleString('en-IN')}</div>
            </div>
            <span style={{ padding:'.3rem .9rem', borderRadius:100, background: STATUS_COLOR[c.status]+'18', color: STATUS_COLOR[c.status], fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em' }}>{c.status}</span>
          </div>
          <div style={{ fontWeight:600, color:'#2d1520', marginBottom:'.4rem' }}>{c.subject}</div>
          <p style={{ color:'#7a5a64', fontSize:'.9rem', lineHeight:1.6, marginBottom:'1rem' }}>{c.message}</p>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            {['read','replied','closed'].map(s => (
              <button key={s} onClick={() => updateStatus(c._id, s)} disabled={c.status===s} style={{ padding:'.4rem 1rem', borderRadius:8, border:'1.5px solid rgba(232,53,90,0.2)', background: c.status===s ? '#faf7f8' : 'white', color: c.status===s ? '#9ca3af' : '#e8355a', cursor: c.status===s ? 'default' : 'pointer', fontFamily:'DM Sans, sans-serif', fontWeight:600, fontSize:'.8rem', textTransform:'capitalize' }}>
                Mark {s}
              </button>
            ))}
            <a href={`mailto:${c.email}`} style={{ padding:'.4rem 1rem', borderRadius:8, background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', textDecoration:'none', fontWeight:600, fontSize:'.8rem' }}>Reply via Email</a>
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}
