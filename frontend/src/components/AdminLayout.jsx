import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Calendar, Newspaper, MessageSquare, CreditCard, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/admissions',   icon: FileText,        label: 'Admissions' },
  { to: '/admin/students',     icon: GraduationCap,   label: 'Students' },
  { to: '/admin/fees',         icon: CreditCard,      label: 'Fee Management' },
  { to: '/admin/events',       icon: Calendar,        label: 'Events' },
  { to: '/admin/news',         icon: Newspaper,       label: 'News & Updates' },
  { to: '/admin/contacts',     icon: MessageSquare,   label: 'Enquiries' },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'DM Sans, sans-serif', background:'#f8f5f6' }}>
      {/* Sidebar */}
      <aside style={{ width:250, background:'#1a0a10', display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0, left:0, overflowY:'auto' }}>
        <div style={{ padding:'1.5rem', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, background:'linear-gradient(135deg,#e8355a,#c0234a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🌹</div>
            <div>
              <div style={{ color:'white', fontFamily:'Playfair Display, serif', fontSize:'.88rem', fontWeight:700, lineHeight:1.1 }}>Rose Buds</div>
              <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'.65rem', textTransform:'uppercase', letterSpacing:'.08em' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        <nav style={{ padding:'1rem 0', flex:1 }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:12, padding:'.75rem 1.5rem', textDecoration:'none', color: active ? '#e8355a' : 'rgba(255,255,255,0.65)', background: active ? 'rgba(232,53,90,0.12)' : 'transparent', borderLeft: active ? '3px solid #e8355a' : '3px solid transparent', fontSize:'.9rem', fontWeight: active ? 600 : 400, transition:'all .2s' }}>
                <Icon size={18}/> {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:'.85rem', marginBottom:'.75rem' }}>
            <div style={{ fontWeight:600 }}>{user?.name}</div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'.75rem' }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)', borderRadius:8, padding:'.5rem 1rem', cursor:'pointer', fontSize:'.83rem', width:'100%', transition:'all .2s' }}>
            <LogOut size={14}/> Logout
          </button>
          <Link to="/" style={{ display:'block', textAlign:'center', marginTop:'.5rem', color:'rgba(255,255,255,0.35)', fontSize:'.75rem', textDecoration:'none' }}>← Back to Website</Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft:250, flex:1, minHeight:'100vh' }}>
        <header style={{ background:'white', padding:'1rem 2rem', borderBottom:'1px solid rgba(232,53,90,0.1)', position:'sticky', top:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 12px rgba(200,40,70,0.06)' }}>
          <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.4rem', color:'#1a0a10', fontWeight:700 }}>{title}</h1>
          <Link to="/" style={{ textDecoration:'none', color:'#e8355a', fontSize:'.85rem', fontWeight:500 }}>View Website →</Link>
        </header>
        <div style={{ padding:'2rem' }}>{children}</div>
      </main>
    </div>
  );
}
