import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const CATEGORIES = ['academic','cultural','sports','holiday','admission','exam','other'];
const empty = { title:'', description:'', date:'', endDate:'', location:'', category:'academic', isPublished:true };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/events').then(({ data }) => setEvents(data.events || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const { data } = await api.put(`/events/${editing}`, form);
        setEvents(prev => prev.map(ev => ev._id === editing ? data.event : ev));
        toast.success('Event updated!');
      } else {
        const { data } = await api.post('/events', form);
        setEvents(prev => [data.event, ...prev]);
        toast.success('Event created!');
      }
      setForm(empty); setEditing(null); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (ev) => {
    setForm({ title:ev.title, description:ev.description, date:ev.date?.slice(0,10)||'', endDate:ev.endDate?.slice(0,10)||'', location:ev.location||'', category:ev.category, isPublished:ev.isPublished });
    setEditing(ev._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try { await api.delete(`/events/${id}`); setEvents(prev => prev.filter(e => e._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const CATEGORY_COLOR = { academic:'#3b82f6', cultural:'#8b5cf6', sports:'#22c55e', holiday:'#f59e0b', admission:'#e8355a', exam:'#ef4444', other:'#9ca3af' };

  return (
    <AdminLayout title="Events Management">
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.5rem' }}>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} style={{ padding:'.65rem 1.5rem', borderRadius:10, background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', cursor:'pointer', fontWeight:600, fontFamily:'DM Sans, sans-serif' }}>+ Add Event</button>
      </div>

      {showForm && (
        <div style={{ background:'white', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.08)', border:'1px solid rgba(232,53,90,0.12)' }}>
          <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1.2rem' }}>{editing ? 'Edit Event' : 'New Event'}</h3>
          <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Event Title *</label>
              <input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Description *</label>
              <textarea required value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows={3} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box', resize:'vertical' }} />
            </div>
            {[['date','Start Date','date'],['endDate','End Date (optional)','date'],['location','Location','text']].map(([k,l,t]) => (
              <div key={k}>
                <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>{l}</label>
                <input type={t} required={k==='date'} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Category</label>
              <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:'1/-1', display:'flex', gap:'1rem', alignItems:'center' }}>
              <button type="submit" style={{ padding:'.7rem 2rem', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>{editing ? 'Update' : 'Create'} Event</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }} style={{ padding:'.7rem 1.5rem', background:'#faf7f8', color:'#7a5a64', border:'1.5px solid rgba(232,53,90,0.15)', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Cancel</button>
              <label style={{ display:'flex', alignItems:'center', gap:'.5rem', cursor:'pointer', fontSize:'.88rem', color:'#2d1520', marginLeft:'auto' }}>
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form,isPublished:e.target.checked})} /> Published
              </label>
            </div>
          </form>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.2rem' }}>
        {loading ? <p style={{ color:'#7a5a64' }}>Loading events...</p> : events.length === 0 ? <p style={{ color:'#7a5a64' }}>No events yet. Create one!</p> :
          events.map(ev => (
            <div key={ev._id} style={{ background:'white', borderRadius:16, padding:'1.3rem', boxShadow:'0 4px 16px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.75rem' }}>
                <span style={{ padding:'.25rem .8rem', borderRadius:100, background: CATEGORY_COLOR[ev.category]+'18', color: CATEGORY_COLOR[ev.category], fontSize:'.73rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em' }}>{ev.category}</span>
                {!ev.isPublished && <span style={{ padding:'.2rem .7rem', borderRadius:100, background:'#f3f4f6', color:'#9ca3af', fontSize:'.72rem', fontWeight:600 }}>Draft</span>}
              </div>
              <h4 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'.4rem', fontSize:'1rem' }}>{ev.title}</h4>
              <p style={{ color:'#7a5a64', fontSize:'.83rem', lineHeight:1.5, marginBottom:'.75rem' }}>{ev.description.slice(0,100)}...</p>
              <div style={{ fontSize:'.8rem', color:'#7a5a64', marginBottom:'1rem' }}>
                📅 {new Date(ev.date).toLocaleDateString('en-IN',{dateStyle:'medium'})}
                {ev.location && <span> · 📍 {ev.location}</span>}
              </div>
              <div style={{ display:'flex', gap:'.5rem' }}>
                <button onClick={() => handleEdit(ev)} style={{ flex:1, padding:'.5rem', borderRadius:8, border:'1.5px solid rgba(232,53,90,0.2)', background:'white', color:'#e8355a', cursor:'pointer', fontWeight:600, fontSize:'.82rem' }}>Edit</button>
                <button onClick={() => handleDelete(ev._id)} style={{ flex:1, padding:'.5rem', borderRadius:8, border:'1.5px solid rgba(239,68,68,0.2)', background:'white', color:'#ef4444', cursor:'pointer', fontWeight:600, fontSize:'.82rem' }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </AdminLayout>
  );
}
