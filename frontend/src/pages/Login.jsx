import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`);
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const s = styles;
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🌹</div>
        <h1 style={s.title}>Welcome Back</h1>
        <p style={s.sub}>Sign in to your Rose Buds portal</p>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={s.label}>Email Address</label>
            <input style={s.input} type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
          </div>
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'.88rem', color:'#7a5a64' }}>
          Don't have an account? <Link to="/register" style={{ color:'#e8355a', fontWeight:600, textDecoration:'none' }}>Register</Link>
        </div>
        <div style={{ textAlign:'center', marginTop:'.5rem', fontSize:'.85rem' }}>
          <Link to="/track" style={{ color:'#7a5a64', textDecoration:'none' }}>Track your application →</Link>
        </div>
        <div style={{ textAlign:'center', marginTop:'.5rem' }}>
          <Link to="/" style={{ color:'#7a5a64', textDecoration:'none', fontSize:'.82rem' }}>← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'linear-gradient(135deg,#fdf0f3,#fff5f0)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'DM Sans, sans-serif' },
  card: { background:'white', borderRadius:24, padding:'2.5rem', width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(200,40,70,0.12)', border:'1px solid rgba(232,53,90,0.1)' },
  logo: { width:56, height:56, background:'linear-gradient(135deg,#e8355a,#c0234a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 1.2rem', boxShadow:'0 6px 20px rgba(232,53,90,0.3)' },
  title: { fontFamily:'Playfair Display, serif', fontSize:'1.7rem', color:'#1a0a10', textAlign:'center', marginBottom:'.3rem' },
  sub: { color:'#7a5a64', textAlign:'center', fontSize:'.9rem', marginBottom:'1.8rem' },
  label: { display:'block', fontSize:'.85rem', fontWeight:600, color:'#2d1520', marginBottom:'.4rem' },
  input: { width:'100%', padding:'.8rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:12, fontFamily:'DM Sans, sans-serif', fontSize:'.92rem', color:'#2d1520', background:'#faf7f8', outline:'none', boxSizing:'border-box', transition:'border-color .2s' },
  btn: { background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:12, padding:'1rem', fontSize:'1rem', fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif', boxShadow:'0 6px 20px rgba(232,53,90,0.3)', transition:'opacity .2s', marginTop:'.5rem' },
};
