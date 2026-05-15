import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', grade:'', section:'', rollNo:'' });

  const fetchStudents = (q='') => {
    setLoading(true);
    api.get(`/students${q ? `?search=${q}` : ''}`)
      .then(({ data }) => setStudents(data.students || []))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', form);
      toast.success('Student added!');
      setShowForm(false);
      setForm({ name:'', email:'', phone:'', grade:'', section:'', rollNo:'' });
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add student'); }
  };

  const GRADES = ['Pre-Nursery','Nursery','LKG','UKG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'];

  return (
    <AdminLayout title="Students">
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && fetchStudents(search)} placeholder="Search by name or ID..." style={{ flex:1, minWidth:220, padding:'.6rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none' }} />
        <button onClick={() => fetchStudents(search)} style={{ padding:'.6rem 1.2rem', borderRadius:10, background:'#faf7f8', border:'1.5px solid rgba(232,53,90,0.2)', cursor:'pointer', fontWeight:600, color:'#e8355a' }}>Search</button>
        <button onClick={() => setShowForm(!showForm)} style={{ padding:'.6rem 1.4rem', borderRadius:10, background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', cursor:'pointer', fontWeight:600, fontFamily:'DM Sans, sans-serif' }}>+ Add Student</button>
      </div>

      {showForm && (
        <div style={{ background:'white', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.08)', border:'1px solid rgba(232,53,90,0.12)' }}>
          <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1.2rem' }}>Add New Student</h3>
          <form onSubmit={handleAdd} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[['name','Full Name','text',true],['email','Email','email',true],['phone','Phone','tel',false],['rollNo','Roll No.','text',false]].map(([k,l,t,r]) => (
              <div key={k}>
                <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>{l}{r?' *':''}</label>
                <input type={t} required={r} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Grade *</label>
              <select required value={form.grade} onChange={e => setForm({...form, grade:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none' }}>
                <option value="">Select Grade</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Section</label>
              <input value={form.section} onChange={e => setForm({...form, section:e.target.value})} placeholder="A / B / C" style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ gridColumn:'1/-1', display:'flex', gap:'1rem' }}>
              <button type="submit" style={{ padding:'.7rem 2rem', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Add Student</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'.7rem 1.5rem', background:'#faf7f8', color:'#7a5a64', border:'1.5px solid rgba(232,53,90,0.15)', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'DM Sans, sans-serif', fontSize:'.9rem' }}>
          <thead>
            <tr style={{ background:'#faf7f8', borderBottom:'2px solid rgba(232,53,90,0.1)' }}>
              {['Student ID','Name','Grade','Section','Roll No.','Parent','Status'].map(h => (
                <th key={h} style={{ padding:'.9rem 1rem', textAlign:'left', fontSize:'.78rem', fontWeight:700, color:'#7a5a64', textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'#7a5a64' }}>Loading students...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'#7a5a64' }}>No students found</td></tr>
            ) : students.map((s,i) => (
              <tr key={s._id} style={{ borderBottom:'1px solid rgba(232,53,90,0.06)', background: i%2===0 ? 'white' : '#fdf8f9' }}>
                <td style={{ padding:'.85rem 1rem', fontWeight:600, color:'#e8355a', fontSize:'.82rem' }}>{s.studentId}</td>
                <td style={{ padding:'.85rem 1rem', fontWeight:600, color:'#1a0a10' }}>{s.name}</td>
                <td style={{ padding:'.85rem 1rem', color:'#2d1520' }}>{s.grade}</td>
                <td style={{ padding:'.85rem 1rem', color:'#2d1520' }}>{s.section || '—'}</td>
                <td style={{ padding:'.85rem 1rem', color:'#2d1520' }}>{s.rollNo || '—'}</td>
                <td style={{ padding:'.85rem 1rem', color:'#7a5a64', fontSize:'.85rem' }}>{s.parentId?.name || '—'}</td>
                <td style={{ padding:'.85rem 1rem' }}>
                  <span style={{ padding:'.2rem .7rem', borderRadius:100, background: s.isActive ? '#dcfce7' : '#fee2e2', color: s.isActive ? '#16a34a' : '#dc2626', fontSize:'.75rem', fontWeight:600 }}>{s.isActive ? 'Active' : 'Inactive'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
