import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/#about',       label: 'About' },
    { to: '/#academics',   label: 'Academics' },
    { to: '/#facilities',  label: 'Facilities' },
    { to: '/#events',      label: 'Events' },
    { to: '/#contact',     label: 'Contact' },
  ];

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(255,255,255,0.97)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(232,53,90,0.12)', boxShadow:'0 2px 20px rgba(200,40,70,0.06)' }}>
      <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:70 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
          <div style={{ width:42, height:42, background:'linear-gradient(135deg,#e8355a,#c0234a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🌹</div>
          <div>
            <div style={{ fontFamily:'Playfair Display, serif', fontWeight:700, fontSize:'1rem', color:'#1a0a10', lineHeight:1.1 }}>Rose Buds Public School</div>
            <div style={{ fontSize:'.7rem', color:'#7a5a64', letterSpacing:'.05em', textTransform:'uppercase' }}>Nurturing Young Minds</div>
          </div>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:'1.8rem' }} className="nav-desktop">
          {navLinks.map(l => (
            <a key={l.to} href={l.to} style={{ textDecoration:'none', color:'#2d1520', fontSize:'.9rem', fontWeight:500, transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color='#e8355a'}
              onMouseLeave={e=>e.target.style.color='#2d1520'}>
              {l.label}
            </a>
          ))}
          {user ? (
            <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
              {isAdmin && (
                <Link to="/admin" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:6, color:'#e8355a', fontSize:'.88rem', fontWeight:600 }}>
                  <Settings size={15}/> Admin
                </Link>
              )}
              <Link to="/dashboard" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:6, color:'#2d1520', fontSize:'.88rem', fontWeight:500 }}>
                <User size={15}/> {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(232,53,90,0.3)', color:'#e8355a', borderRadius:8, padding:'.4rem .9rem', cursor:'pointer', fontSize:'.85rem', fontWeight:500 }}>
                <LogOut size={14}/> Logout
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:'.75rem' }}>
              <Link to="/login" style={{ textDecoration:'none', color:'#e8355a', fontWeight:600, fontSize:'.9rem' }}>Login</Link>
              <Link to="/apply" style={{ textDecoration:'none', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', padding:'.5rem 1.2rem', borderRadius:100, fontSize:'.88rem', fontWeight:600, boxShadow:'0 4px 14px rgba(232,53,90,0.3)' }}>Apply Now</Link>
            </div>
          )}
        </div>

        <button onClick={()=>setOpen(!open)} style={{ display:'none', background:'none', border:'none', cursor:'pointer', padding:8 }} className="hamburger">
          {open ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {open && (
        <div style={{ background:'white', borderTop:'1px solid rgba(232,53,90,0.1)', padding:'1rem 2rem 1.5rem', display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {navLinks.map(l => (
            <a key={l.to} href={l.to} onClick={()=>setOpen(false)} style={{ textDecoration:'none', color:'#2d1520', fontWeight:500, padding:'.6rem 0', borderBottom:'1px solid rgba(232,53,90,0.08)' }}>{l.label}</a>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={()=>setOpen(false)} style={{ textDecoration:'none', color:'#2d1520', fontWeight:500, padding:'.6rem 0' }}>My Dashboard</Link>
              {isAdmin && <Link to="/admin" onClick={()=>setOpen(false)} style={{ textDecoration:'none', color:'#e8355a', fontWeight:600, padding:'.6rem 0' }}>Admin Panel</Link>}
              <button onClick={()=>{handleLogout();setOpen(false);}} style={{ background:'none', border:'none', color:'#e8355a', textAlign:'left', padding:'.6rem 0', cursor:'pointer', fontWeight:600 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={()=>setOpen(false)} style={{ textDecoration:'none', color:'#2d1520', fontWeight:500, padding:'.6rem 0' }}>Login</Link>
              <Link to="/apply" onClick={()=>setOpen(false)} style={{ textDecoration:'none', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', padding:'.7rem 1.5rem', borderRadius:100, fontWeight:600, textAlign:'center', marginTop:'.5rem' }}>Apply for Admission</Link>
            </>
          )}
        </div>
      )}

      <style>{`.hamburger{display:none!important}@media(max-width:900px){.nav-desktop{display:none!important}.hamburger{display:flex!important}}`}</style>
    </nav>
  );
}
