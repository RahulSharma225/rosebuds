import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const empty = { title:'', content:'', excerpt:'', category:'news', isPublished:true, isPinned:false };
const CATEGORIES = ['news','announcement','achievement','circular'];
const CAT_COLOR = { news:'#3b82f6', announcement:'#f59e0b', achievement:'#22c55e', circular:'#8b5cf6' };

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/news?limit=50').then(({ data }) => setNews(data.news || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const { data } = await api.put(`/news/${editing}`, form);
        setNews(prev => prev.map(n => n._id === editing ? data.news : n));
        toast.success('Article updated!');
      } else {
        const { data } = await api.post('/news', form);
        setNews(prev => [data.news, ...prev]);
        toast.success('Article published!');
      }
      setForm(empty); setEditing(null); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try { await api.delete(`/news/${id}`); setNews(prev => prev.filter(n => n._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const handleEdit = (n) => {
    setForm({ title:n.title, content:n.content, excerpt:n.excerpt||'', category:n.category, isPublished:n.isPublished, isPinned:n.isPinned });
    setEditing(n._id); setShowForm(true);
  };

  return (
    <AdminLayout title="News & Announcements">
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.5rem' }}>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} style={{ padding:'.65rem 1.5rem', borderRadius:10, background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', cursor:'pointer', fontWeight:600, fontFamily:'DM Sans, sans-serif' }}>+ New Article</button>
      </div>

      {showForm && (
        <div style={{ background:'white', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.08)', border:'1px solid rgba(232,53,90,0.12)' }}>
          <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1.2rem' }}>{editing ? 'Edit Article' : 'New Article'}</h3>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Title *</label>
              <input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Short Excerpt</label>
              <input value={form.excerpt} onChange={e => setForm({...form,excerpt:e.target.value})} placeholder="Brief summary shown in previews" style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Full Content *</label>
              <textarea required value={form.content} onChange={e => setForm({...form,content:e.target.value})} rows={6} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box', resize:'vertical' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Category</label>
                <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-end', paddingBottom:'.4rem' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'.5rem', cursor:'pointer', fontSize:'.88rem', color:'#2d1520' }}>
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form,isPublished:e.target.checked})} /> Published
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:'.5rem', cursor:'pointer', fontSize:'.88rem', color:'#2d1520' }}>
                  <input type="checkbox" checked={form.isPinned} onChange={e => setForm({...form,isPinned:e.target.checked})} /> 📌 Pin
                </label>
              </div>
            </div>
            <div style={{ display:'flex', gap:'1rem' }}>
              <button type="submit" style={{ padding:'.7rem 2rem', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>{editing ? 'Update' : 'Publish'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }} style={{ padding:'.7rem 1.5rem', background:'#faf7f8', color:'#7a5a64', border:'1.5px solid rgba(232,53,90,0.15)', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {loading ? <p style={{ color:'#7a5a64' }}>Loading articles...</p> : news.length === 0 ? <p style={{ color:'#7a5a64' }}>No articles yet.</p> :
          news.map(n => (
            <div key={n._id} style={{ background:'white', borderRadius:16, padding:'1.3rem', boxShadow:'0 4px 16px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:'.5rem', marginBottom:'.5rem', flexWrap:'wrap', alignItems:'center' }}>
                  <span style={{ padding:'.2rem .7rem', borderRadius:100, background: CAT_COLOR[n.category]+'18', color: CAT_COLOR[n.category], fontSize:'.72rem', fontWeight:700, textTransform:'uppercase' }}>{n.category}</span>
                  {n.isPinned && <span style={{ fontSize:'.75rem' }}>📌 Pinned</span>}
                  {!n.isPublished && <span style={{ padding:'.2rem .7rem', borderRadius:100, background:'#f3f4f6', color:'#9ca3af', fontSize:'.72rem', fontWeight:600 }}>Draft</span>}
                  <span style={{ fontSize:'.78rem', color:'#9ca3af' }}>{new Date(n.publishedAt).toLocaleDateString('en-IN')} · {n.views} views</span>
                </div>
                <h4 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'.3rem' }}>{n.title}</h4>
                <p style={{ color:'#7a5a64', fontSize:'.85rem', lineHeight:1.5 }}>{n.excerpt || n.content.slice(0,120)}...</p>
              </div>
              <div style={{ display:'flex', gap:'.5rem', flexShrink:0 }}>
                <button onClick={() => handleEdit(n)} style={{ padding:'.45rem .9rem', borderRadius:8, border:'1.5px solid rgba(232,53,90,0.2)', background:'white', color:'#e8355a', cursor:'pointer', fontWeight:600, fontSize:'.82rem' }}>Edit</button>
                <button onClick={() => handleDelete(n._id)} style={{ padding:'.45rem .9rem', borderRadius:8, border:'1.5px solid rgba(239,68,68,0.2)', background:'white', color:'#ef4444', cursor:'pointer', fontWeight:600, fontSize:'.82rem' }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </AdminLayout>
  );
}
