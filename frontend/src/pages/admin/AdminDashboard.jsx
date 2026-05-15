import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(console.error).finally(()=>setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><p style={{ color:'#7a5a64' }}>Loading dashboard...</p></AdminLayout>;

  const s = stats?.stats || {};
  const cards = [
    { label:'Total Students',    value: s.students || 0,                icon:'🎓', color:'#3b82f6', to:'/admin/students' },
    { label:'Parents Registered', value: s.parents || 0,               icon:'👨‍👩‍👧', color:'#8b5cf6', to:'/admin/users' },
    { label:'Admissions (Total)', value: s.admissions?.total || 0,     icon:'📝', color:'#f59e0b', to:'/admin/admissions' },
    { label:'Pending Admissions', value: s.admissions?.pending || 0,   icon:'⏳', color:'#ef4444', to:'/admin/admissions' },
    { label:'New Enquiries',      value: s.contacts?.new || 0,         icon:'✉️', color:'#e8355a', to:'/admin/contacts' },
    { label:'Fees Collected',     value: `₹${(s.fees?.collected||0).toLocaleString()}`, icon:'💰', color:'#22c55e', to:'/admin/fees' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.2rem', marginBottom:'2rem' }}>
        {cards.map(({ label, value, icon, color, to }) => (
          <Link key={label} to={to} style={{ textDecoration:'none', background:'white', borderRadius:18, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)', transition:'transform .2s, box-shadow .2s', display:'block' }}>
            <div style={{ fontSize:28, marginBottom:'.5rem' }}>{icon}</div>
            <div style={{ fontFamily:'Playfair Display, serif', fontSize:'1.8rem', fontWeight:700, color }}>{value}</div>
            <div style={{ fontSize:'.8rem', color:'#7a5a64', marginTop:'.2rem' }}>{label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        <div style={{ background:'white', borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
            <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10' }}>Upcoming Events</h3>
            <Link to="/admin/events" style={{ color:'#e8355a', textDecoration:'none', fontSize:'.82rem', fontWeight:600 }}>Manage →</Link>
          </div>
          {(stats?.upcomingEvents || []).length === 0 ? <p style={{ color:'#7a5a64', fontSize:'.9rem' }}>No upcoming events</p> :
            (stats.upcomingEvents || []).map(ev => (
              <div key={ev._id} style={{ padding:'.75rem 0', borderBottom:'1px solid rgba(232,53,90,0.08)', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                <div style={{ background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', borderRadius:10, padding:'.4rem .7rem', textAlign:'center', minWidth:45, lineHeight:1.1 }}>
                  <div style={{ fontWeight:700, fontSize:'1.1rem' }}>{new Date(ev.date).getDate()}</div>
                  <div style={{ fontSize:'.62rem', opacity:.9 }}>{new Date(ev.date).toLocaleString('default',{month:'short'})}</div>
                </div>
                <div>
                  <div style={{ fontWeight:600, color:'#2d1520', fontSize:'.9rem' }}>{ev.title}</div>
                  <div style={{ fontSize:'.78rem', color:'#7a5a64', textTransform:'capitalize' }}>{ev.category} · {ev.location}</div>
                </div>
              </div>
            ))}
        </div>

        <div style={{ background:'white', borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
            <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10' }}>Recent News</h3>
            <Link to="/admin/news" style={{ color:'#e8355a', textDecoration:'none', fontSize:'.82rem', fontWeight:600 }}>Manage →</Link>
          </div>
          {(stats?.recentNews || []).length === 0 ? <p style={{ color:'#7a5a64', fontSize:'.9rem' }}>No news articles</p> :
            (stats.recentNews || []).map(n => (
              <div key={n._id} style={{ padding:'.75rem 0', borderBottom:'1px solid rgba(232,53,90,0.08)' }}>
                <div style={{ fontWeight:600, color:'#2d1520', fontSize:'.9rem' }}>{n.isPinned ? '📌 ' : ''}{n.title}</div>
                <div style={{ fontSize:'.78rem', color:'#7a5a64', marginTop:'.15rem', textTransform:'capitalize' }}>{n.category} · {new Date(n.publishedAt).toLocaleDateString('en-IN')} · {n.views} views</div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
