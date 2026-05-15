import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student:'', studentName:'', grade:'', academicYear:'2026-27', feeType:'tuition', amount:'', dueDate:'' });

  useEffect(() => {
    Promise.all([
      api.get('/fees'),
      api.get('/students')
    ]).then(([feesRes, stuRes]) => {
      setFees(feesRes.data.fees || []);
      setStudents(stuRes.data.students || []);
    }).catch(() => toast.error('Failed to load data')).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/fees', form);
      setFees(prev => [data.fee, ...prev]);
      toast.success('Fee record created!');
      setShowForm(false);
      setForm({ student:'', studentName:'', grade:'', academicYear:'2026-27', feeType:'tuition', amount:'', dueDate:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create fee'); }
  };

  const handleStudentChange = (id) => {
    const s = students.find(s => s._id === id);
    if (s) setForm(f => ({ ...f, student:id, studentName:s.name, grade:s.grade||'' }));
  };

  const STATUS_COLOR = { pending:'#f59e0b', paid:'#22c55e', overdue:'#ef4444', partial:'#3b82f6', waived:'#8b5cf6' };
  const totalCollected = fees.filter(f=>f.status==='paid').reduce((s,f)=>s+f.amount,0);
  const totalPending = fees.filter(f=>f.status==='pending'||f.status==='overdue').reduce((s,f)=>s+f.amount,0);

  return (
    <AdminLayout title="Fee Management">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { label:'Total Collected', value:`₹${totalCollected.toLocaleString()}`, color:'#22c55e' },
          { label:'Pending / Overdue', value:`₹${totalPending.toLocaleString()}`, color:'#ef4444' },
          { label:'Total Records', value:fees.length, color:'#3b82f6' },
        ].map(({label,value,color}) => (
          <div key={label} style={{ background:'white', borderRadius:16, padding:'1.2rem', boxShadow:'0 4px 16px rgba(200,40,70,0.06)', border:'1px solid rgba(232,53,90,0.08)' }}>
            <div style={{ fontFamily:'Playfair Display, serif', fontSize:'1.6rem', fontWeight:700, color }}>{value}</div>
            <div style={{ fontSize:'.8rem', color:'#7a5a64', marginTop:'.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
        <button onClick={() => setShowForm(!showForm)} style={{ padding:'.65rem 1.5rem', borderRadius:10, background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', cursor:'pointer', fontWeight:600, fontFamily:'DM Sans, sans-serif' }}>+ Create Fee Record</button>
      </div>

      {showForm && (
        <div style={{ background:'white', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.08)', border:'1px solid rgba(232,53,90,0.12)' }}>
          <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1.2rem' }}>New Fee Record</h3>
          <form onSubmit={handleAdd} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>Select Student *</label>
              <select required value={form.student} onChange={e => handleStudentChange(e.target.value)} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none' }}>
                <option value="">Select a student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} — {s.grade} {s.section}</option>)}
              </select>
            </div>
            {[['feeType','Fee Type','select'],['amount','Amount (₹)','number'],['academicYear','Academic Year','text'],['dueDate','Due Date','date']].map(([k,l,t]) => (
              <div key={k}>
                <label style={{ display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' }}>{l}</label>
                {t==='select' ? (
                  <select value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none' }}>
                    {['tuition','transport','activity','exam','other'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
                  </select>
                ) : (
                  <input type={t} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required={k!=='dueDate'} style={{ width:'100%', padding:'.7rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', outline:'none', boxSizing:'border-box' }} />
                )}
              </div>
            ))}
            <div style={{ gridColumn:'1/-1', display:'flex', gap:'1rem' }}>
              <button type="submit" style={{ padding:'.7rem 2rem', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Create Record</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding:'.7rem 1.5rem', background:'#faf7f8', color:'#7a5a64', border:'1.5px solid rgba(232,53,90,0.15)', borderRadius:10, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'DM Sans, sans-serif', fontSize:'.88rem' }}>
          <thead>
            <tr style={{ background:'#faf7f8', borderBottom:'2px solid rgba(232,53,90,0.1)' }}>
              {['Student','Grade','Fee Type','Year','Amount','Due Date','Status'].map(h => (
                <th key={h} style={{ padding:'.9rem 1rem', textAlign:'left', fontSize:'.75rem', fontWeight:700, color:'#7a5a64', textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'#7a5a64' }}>Loading...</td></tr>
            ) : fees.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'#7a5a64' }}>No fee records</td></tr>
            ) : fees.map((f,i) => (
              <tr key={f._id} style={{ borderBottom:'1px solid rgba(232,53,90,0.06)', background: i%2===0 ? 'white' : '#fdf8f9' }}>
                <td style={{ padding:'.85rem 1rem', fontWeight:600, color:'#1a0a10' }}>{f.studentName}</td>
                <td style={{ padding:'.85rem 1rem', color:'#7a5a64' }}>{f.grade}</td>
                <td style={{ padding:'.85rem 1rem', color:'#2d1520', textTransform:'capitalize' }}>{f.feeType}</td>
                <td style={{ padding:'.85rem 1rem', color:'#7a5a64' }}>{f.academicYear}</td>
                <td style={{ padding:'.85rem 1rem', fontWeight:700, color:'#1a0a10' }}>₹{f.amount.toLocaleString()}</td>
                <td style={{ padding:'.85rem 1rem', color:'#7a5a64' }}>{f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                <td style={{ padding:'.85rem 1rem' }}>
                  <span style={{ padding:'.25rem .75rem', borderRadius:100, background: STATUS_COLOR[f.status]+'18', color: STATUS_COLOR[f.status], fontSize:'.75rem', fontWeight:700, textTransform:'capitalize' }}>{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
