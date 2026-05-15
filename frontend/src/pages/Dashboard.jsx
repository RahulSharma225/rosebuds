// Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fees').then(({ data }) => setFees(data.fees || [])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const totalDue = fees.filter(f=>f.status==='pending'||f.status==='overdue').reduce((s,f)=>s+f.amount,0);
  const totalPaid = fees.filter(f=>f.status==='paid').reduce((s,f)=>s+f.amount,0);

  const s = styles;
  return (
    <>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'#f8f5f6', paddingTop:90, fontFamily:'DM Sans, sans-serif' }}>
        <div style={{ maxWidth:1000, margin:'auto', padding:'2rem 1.5rem' }}>
          <div style={{ marginBottom:'2rem' }}>
            <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.8rem', color:'#1a0a10' }}>Welcome, {user?.name.split(' ')[0]} 👋</h1>
            <p style={{ color:'#7a5a64' }}>Manage your child's school activities from here.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:'1.2rem', marginBottom:'2rem' }}>
            {[
              { label:'Total Fees Due', value:`₹${totalDue.toLocaleString()}`, color:'#ef4444', icon:'💰' },
              { label:'Total Paid', value:`₹${totalPaid.toLocaleString()}`, color:'#22c55e', icon:'✅' },
              { label:'Fee Records', value:fees.length, color:'#3b82f6', icon:'📄' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={{ background:'white', borderRadius:18, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
                <div style={{ fontSize:28, marginBottom:'.5rem' }}>{icon}</div>
                <div style={{ fontSize:'1.5rem', fontWeight:700, color, fontFamily:'Playfair Display, serif' }}>{value}</div>
                <div style={{ fontSize:'.82rem', color:'#7a5a64', marginTop:'.2rem' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
            <div style={{ background:'white', borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
              <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1.2rem' }}>Fee Summary</h3>
              {loading ? <p style={{ color:'#7a5a64' }}>Loading...</p> : fees.length === 0 ? (
                <p style={{ color:'#7a5a64', fontSize:'.9rem' }}>No fee records found. Contact school admin.</p>
              ) : fees.slice(0,5).map(fee => (
                <div key={fee._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.75rem 0', borderBottom:'1px solid rgba(232,53,90,0.08)' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'.9rem', color:'#2d1520' }}>{fee.feeType} Fee</div>
                    <div style={{ fontSize:'.78rem', color:'#7a5a64' }}>{fee.academicYear} · Due {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-IN') : 'N/A'}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:700, color: fee.status==='paid' ? '#22c55e' : '#ef4444' }}>₹{fee.amount.toLocaleString()}</div>
                    <div style={{ fontSize:'.72rem', textTransform:'capitalize', color:'#7a5a64' }}>{fee.status}</div>
                  </div>
                </div>
              ))}
              {fees.some(f=>f.status==='pending') && (
                <Link to="/fees" style={{ display:'block', marginTop:'1rem', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', textAlign:'center', textDecoration:'none', padding:'.7rem', borderRadius:10, fontWeight:600, fontSize:'.9rem' }}>Pay Fees Online →</Link>
              )}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ background:'white', borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
                <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1rem' }}>Quick Actions</h3>
                {[
                  { to:'/fees', label:'💳  Pay Fees Online' },
                  { to:'/apply', label:'📝  New Admission' },
                  { to:'/track', label:'🔍  Track Application' },
                ].map(({ to, label }) => (
                  <Link key={to} to={to} style={{ display:'block', padding:'.75rem 1rem', marginBottom:'.5rem', background:'#faf7f8', borderRadius:10, textDecoration:'none', color:'#2d1520', fontWeight:500, fontSize:'.9rem', border:'1px solid rgba(232,53,90,0.1)', transition:'background .2s' }}>
                    {label}
                  </Link>
                ))}
              </div>
              <div style={{ background:'linear-gradient(135deg,#e8355a,#c0234a)', borderRadius:20, padding:'1.5rem', color:'white' }}>
                <div style={{ fontSize:32, marginBottom:'.5rem' }}>📞</div>
                <h4 style={{ marginBottom:'.3rem' }}>Need Help?</h4>
                <p style={{ opacity:.85, fontSize:'.85rem', lineHeight:1.5 }}>Contact school admin at<br/><strong>+91 98765 43210</strong><br/>Mon–Sat, 8am–3pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {};
