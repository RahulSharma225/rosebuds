import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    const result = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to Rose Buds.');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const s = styles;
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🌹</div>
        <h1 style={s.title}>Create Account</h1>
        <p style={s.sub}>Register as a parent to track admissions & pay fees</p>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>
          {[
            { key:'name', label:'Full Name', type:'text', placeholder:'Your full name' },
            { key:'email', label:'Email Address', type:'email', placeholder:'your@email.com' },
            { key:'phone', label:'Phone Number', type:'tel', placeholder:'+91 XXXXX XXXXX' },
            { key:'password', label:'Password', type:'password', placeholder:'Minimum 6 characters' },
            { key:'confirmPassword', label:'Confirm Password', type:'password', placeholder:'Repeat password' },
          ].map(f => (
            <div key={f.key}>
              <label style={s.label}>{f.label}</label>
              <input style={s.input} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} required />
            </div>
          ))}
          <button type="submit" disabled={loading} style={s.btn}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <div style={{ textAlign:'center', marginTop:'1.2rem', fontSize:'.88rem', color:'#7a5a64' }}>
          Already have an account? <Link to="/login" style={{ color:'#e8355a', fontWeight:600, textDecoration:'none' }}>Sign In</Link>
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
  card: { background:'white', borderRadius:24, padding:'2.5rem', width:'100%', maxWidth:440, boxShadow:'0 20px 60px rgba(200,40,70,0.12)', border:'1px solid rgba(232,53,90,0.1)' },
  logo: { width:52, height:52, background:'linear-gradient(135deg,#e8355a,#c0234a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 1rem', boxShadow:'0 6px 20px rgba(232,53,90,0.3)' },
  title: { fontFamily:'Playfair Display, serif', fontSize:'1.6rem', color:'#1a0a10', textAlign:'center', marginBottom:'.25rem' },
  sub: { color:'#7a5a64', textAlign:'center', fontSize:'.85rem', marginBottom:'1.5rem' },
  label: { display:'block', fontSize:'.82rem', fontWeight:600, color:'#2d1520', marginBottom:'.35rem' },
  input: { width:'100%', padding:'.75rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', color:'#2d1520', background:'#faf7f8', outline:'none', boxSizing:'border-box' },
  btn: { background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:12, padding:'.9rem', fontSize:'.95rem', fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif', boxShadow:'0 6px 20px rgba(232,53,90,0.3)', marginTop:'.5rem' },
};
