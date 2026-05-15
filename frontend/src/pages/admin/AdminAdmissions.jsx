import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:      { color:'#f59e0b', label:'Pending' },
  under_review: { color:'#3b82f6', label:'Under Review' },
  shortlisted:  { color:'#8b5cf6', label:'Shortlisted' },
  accepted:     { color:'#22c55e', label:'Accepted' },
  rejected:     { color:'#ef4444', label:'Rejected' },
  waitlisted:   { color:'#f97316', label:'Waitlisted' },
};

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetch = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    if (search) params.set('search', search);
    api.get(`/admissions?${params}`).then(({ data }) => setAdmissions(data.admissions || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [filter]);

  const updateStatus = async (id, status, note='') => {
    try {
      const { data } = await api.patch(`/admissions/${id}/status`, { status, statusNote: note });
      setAdmissions(prev => prev.map(a => a._id === id ? data.admission : a));
      setSelected(data.admission);
      toast.success('Status updated!');
    } catch { toast.error('Update failed'); }
  };

  return (
    <AdminLayout title="Admissions Management">
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetch()} placeholder="Search name or app number..." style={{ flex:1, minWidth:200, padding:'.6rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none' }} />
        <button onClick={fetch} style={{ padding:'.6rem 1.2rem', borderRadius:10, background:'#faf7f8', border:'1.5px solid rgba(232,53,90,0.2)', cursor:'pointer', fontWeight:600, color:'#e8355a' }}>Search</button>
        {Object.entries({'':{label:'All'}, ...STATUS_CONFIG}).map(([k,{label}]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding:'.5rem 1rem', borderRadius:100, border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontWeight:600, fontSize:'.82rem', background: filter===k ? '#e8355a' : 'white', color: filter===k ? 'white' : '#7a5a64', boxShadow:'0 2px 8px rgba(200,40,70,0.08)' }}>{label}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap:'1.5rem' }}>
        <div style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'DM Sans, sans-serif', fontSize:'.88rem' }}>
            <thead>
              <tr style={{ background:'#faf7f8', borderBottom:'2px solid rgba(232,53,90,0.1)' }}>
                {['App No.','Student','Grade','Parent','Phone','Submitted','Status'].map(h => (
                  <th key={h} style={{ padding:'.9rem 1rem', textAlign:'left', fontSize:'.75rem', fontWeight:700, color:'#7a5a64', textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'#7a5a64' }}>Loading...</td></tr>
               : admissions.length === 0 ? <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'#7a5a64' }}>No applications found</td></tr>
               : admissions.map((a,i) => {
                const sc = STATUS_CONFIG[a.status] || {};
                return (
                  <tr key={a._id} onClick={() => setSelected(a)} style={{ borderBottom:'1px solid rgba(232,53,90,0.06)', background: selected?._id===a._id ? '#fdf0f3' : i%2===0 ? 'white' : '#fdf8f9', cursor:'pointer' }}>
                    <td style={{ padding:'.85rem 1rem', fontWeight:700, color:'#e8355a', fontSize:'.82rem' }}>{a.applicationNumber}</td>
                    <td style={{ padding:'.85rem 1rem', fontWeight:600, color:'#1a0a10' }}>{a.studentName}</td>
                    <td style={{ padding:'.85rem 1rem', color:'#2d1520' }}>{a.applyingForGrade}</td>
                    <td style={{ padding:'.85rem 1rem', color:'#7a5a64' }}>{a.parentName}</td>
                    <td style={{ padding:'.85rem 1rem', color:'#7a5a64' }}>{a.parentPhone}</td>
                    <td style={{ padding:'.85rem 1rem', color:'#7a5a64' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding:'.85rem 1rem' }}>
                      <span style={{ padding:'.2rem .7rem', borderRadius:100, background: sc.color+'18', color: sc.color, fontSize:'.75rem', fontWeight:700 }}>{sc.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (
          <div style={{ background:'white', borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)', height:'fit-content', position:'sticky', top:80 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
              <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', fontSize:'1.1rem' }}>Application Details</h3>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#7a5a64', fontSize:'1.2rem' }}>×</button>
            </div>
            {[['App No.', selected.applicationNumber],['Student', selected.studentName],['Grade', selected.applyingForGrade],['DOB', new Date(selected.dateOfBirth).toLocaleDateString('en-IN')],['Gender', selected.gender],['Parent', selected.parentName],['Email', selected.parentEmail],['Phone', selected.parentPhone],['Year', selected.academicYear]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'.5rem 0', borderBottom:'1px solid rgba(232,53,90,0.07)', fontSize:'.85rem' }}>
                <span style={{ color:'#7a5a64' }}>{l}</span>
                <span style={{ fontWeight:600, color:'#1a0a10', textAlign:'right', maxWidth:'60%', wordBreak:'break-all' }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:'1.2rem' }}>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.5rem' }}>Update Status</label>
              <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                {Object.entries(STATUS_CONFIG).map(([k,{label,color}]) => (
                  <button key={k} onClick={() => updateStatus(selected._id, k)} style={{ padding:'.5rem 1rem', borderRadius:8, border: selected.status===k ? `2px solid ${color}` : '1.5px solid rgba(232,53,90,0.15)', background: selected.status===k ? color+'12' : 'white', color: selected.status===k ? color : '#2d1520', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontWeight: selected.status===k ? 700 : 400, fontSize:'.85rem', textAlign:'left', transition:'all .2s' }}>
                    {selected.status===k ? '✓ ' : ''}{label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
