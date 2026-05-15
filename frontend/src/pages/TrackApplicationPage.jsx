import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:      { label:'Pending Review',  color:'#f59e0b', bg:'#fffbeb', icon:'⏳' },
  under_review: { label:'Under Review',    color:'#3b82f6', bg:'#eff6ff', icon:'🔍' },
  shortlisted:  { label:'Shortlisted',     color:'#8b5cf6', bg:'#f5f3ff', icon:'⭐' },
  accepted:     { label:'Accepted! 🎉',    color:'#22c55e', bg:'#f0fdf4', icon:'✅' },
  rejected:     { label:'Not Selected',    color:'#ef4444', bg:'#fef2f2', icon:'❌' },
  waitlisted:   { label:'Waitlisted',      color:'#f97316', bg:'#fff7ed', icon:'📋' },
};

export default function TrackApplicationPage() {
  const { appNo } = useParams();
  const [appNumber, setAppNumber] = useState(appNo || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!appNumber.trim()) return toast.error('Please enter your application number');
    setLoading(true);
    try {
      const { data } = await api.get(`/admissions/${appNumber.trim()}`);
      setResult(data.admission);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application not found');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const status = result ? STATUS_CONFIG[result.status] : null;
  const s = styles;

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#fdf0f3,#fff5f0)', paddingTop:100, paddingBottom:60, fontFamily:'DM Sans, sans-serif' }}>
        <div style={{ maxWidth:600, margin:'auto', padding:'0 1.5rem' }}>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#e8355a', marginBottom:'.5rem' }}>Application Status</div>
            <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'2rem', color:'#1a0a10' }}>Track Your Application</h1>
          </div>

          <div style={s.card}>
            <form onSubmit={handleSearch} style={{ display:'flex', gap:'1rem', marginBottom: result ? '2rem' : 0 }}>
              <input style={{ ...s.input, flex:1 }} value={appNumber} onChange={e=>setAppNumber(e.target.value)} placeholder="Enter Application No. (e.g. RB-2026-0001)" />
              <button type="submit" disabled={loading} style={s.btn}>{loading ? '...' : 'Track'}</button>
            </form>

            {result && status && (
              <div>
                <div style={{ background:status.bg, border:`1.5px solid ${status.color}30`, borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem', textAlign:'center' }}>
                  <div style={{ fontSize:40, marginBottom:'.5rem' }}>{status.icon}</div>
                  <div style={{ fontSize:'1.2rem', fontWeight:700, color:status.color }}>{status.label}</div>
                  {result.statusNote && <p style={{ color:'#7a5a64', fontSize:'.9rem', marginTop:'.5rem' }}>{result.statusNote}</p>}
                  {result.interviewDate && <p style={{ color:'#2d1520', fontSize:'.9rem', marginTop:'.5rem', fontWeight:600 }}>Interview Date: {new Date(result.interviewDate).toLocaleDateString('en-IN', { dateStyle:'long' })}</p>}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  {[
                    ['Application No.', result.applicationNumber],
                    ['Applied For', result.applyingForGrade],
                    ['Student Name', result.studentName],
                    ['Academic Year', result.academicYear],
                    ['Parent Name', result.parentName],
                    ['Submitted On', new Date(result.createdAt).toLocaleDateString('en-IN')],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background:'#faf7f8', borderRadius:12, padding:'1rem' }}>
                      <div style={{ fontSize:'.75rem', color:'#7a5a64', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'.2rem' }}>{label}</div>
                      <div style={{ fontWeight:600, color:'#1a0a10', fontSize:'.92rem' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ textAlign:'center', marginTop:'1.5rem' }}>
            <Link to="/apply" style={{ color:'#e8355a', textDecoration:'none', fontWeight:600 }}>Submit a new application →</Link>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  card: { background:'white', borderRadius:24, padding:'2rem', boxShadow:'0 20px 60px rgba(200,40,70,0.10)', border:'1px solid rgba(232,53,90,0.1)' },
  input: { padding:'.8rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.92rem', color:'#2d1520', background:'#faf7f8', outline:'none', boxSizing:'border-box' },
  btn: { background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:10, padding:'.8rem 1.5rem', fontSize:'.92rem', fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif', whiteSpace:'nowrap' },
};
