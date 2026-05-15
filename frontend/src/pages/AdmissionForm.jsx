import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const GRADES = ['Pre-Nursery','Nursery','LKG','UKG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'];

export default function AdmissionForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [appNumber, setAppNumber] = useState(null);
  const [form, setForm] = useState({
    studentName:'', dateOfBirth:'', gender:'male', applyingForGrade:'', previousSchool:'', previousGrade:'',
    parentName:'', parentEmail:'', parentPhone:'', parentOccupation:'', relationship:'father',
    address:{ street:'', city:'', state:'', pincode:'' },
    academicYear:'2026-27', message:''
  });

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const setAddr = (field, val) => setForm(f => ({ ...f, address: { ...f.address, [field]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admissions', form);
      setAppNumber(data.applicationNumber);
      toast.success('Application submitted successfully!');
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const s = styles;
  return (
    <>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#fdf0f3,#fff5f0)', paddingTop:90, paddingBottom:60, fontFamily:'DM Sans, sans-serif' }}>
        <div style={{ maxWidth:700, margin:'auto', padding:'0 1.5rem' }}>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#e8355a', marginBottom:'.5rem' }}>Join Our School</div>
            <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'2.2rem', color:'#1a0a10' }}>Admission Application</h1>
            <p style={{ color:'#7a5a64', marginTop:'.5rem' }}>Academic Year 2026–27 · Applications Open</p>
          </div>

          {step < 4 && (
            <div style={{ display:'flex', gap:'.5rem', marginBottom:'2rem', justifyContent:'center' }}>
              {['Student Info', 'Parent Info', 'Address & Submit'].map((label, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background: step > i+1 ? '#22c55e' : step === i+1 ? '#e8355a' : '#e5e7eb', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', fontWeight:700 }}>
                    {step > i+1 ? '✓' : i+1}
                  </div>
                  <span style={{ fontSize:'.8rem', fontWeight: step === i+1 ? 600 : 400, color: step === i+1 ? '#e8355a' : '#7a5a64' }}>{label}</span>
                  {i < 2 && <div style={{ width:30, height:2, background:'#e5e7eb', margin:'0 .3rem' }}/>}
                </div>
              ))}
            </div>
          )}

          <div style={s.card}>
            {step === 4 ? (
              <div style={{ textAlign:'center', padding:'2rem' }}>
                <div style={{ fontSize:60, marginBottom:'1rem' }}>🎉</div>
                <h2 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'.5rem' }}>Application Submitted!</h2>
                <p style={{ color:'#7a5a64', marginBottom:'1.5rem' }}>Your application number is:</p>
                <div style={{ background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', borderRadius:16, padding:'1.2rem 2rem', display:'inline-block', marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:'.8rem', opacity:.85, marginBottom:'.2rem' }}>Application Number</div>
                  <div style={{ fontFamily:'Playfair Display, serif', fontSize:'1.8rem', fontWeight:700 }}>{appNumber}</div>
                </div>
                <p style={{ color:'#7a5a64', fontSize:'.9rem', marginBottom:'1.5rem' }}>Save this number to track your application status. We will contact you within 3-5 business days.</p>
                <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                  <Link to={`/track/${appNumber}`} style={{ ...s.btnPrimary, textDecoration:'none', display:'inline-block' }}>Track Application</Link>
                  <Link to="/" style={{ ...s.btnOutline, textDecoration:'none', display:'inline-block' }}>Back to Home</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={step === 3 ? handleSubmit : (e)=>{e.preventDefault(); setStep(s=>s+1);}}>
                {step === 1 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <h2 style={s.stepTitle}>Student Information</h2>
                    <div style={s.formRow}>
                      <div><label style={s.label}>Full Name *</label><input style={s.input} value={form.studentName} onChange={e=>set('studentName',e.target.value)} placeholder="Student's full name" required /></div>
                      <div><label style={s.label}>Date of Birth *</label><input style={s.input} type="date" value={form.dateOfBirth} onChange={e=>set('dateOfBirth',e.target.value)} required /></div>
                    </div>
                    <div style={s.formRow}>
                      <div>
                        <label style={s.label}>Gender *</label>
                        <select style={s.input} value={form.gender} onChange={e=>set('gender',e.target.value)} required>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={s.label}>Applying for Grade *</label>
                        <select style={s.input} value={form.applyingForGrade} onChange={e=>set('applyingForGrade',e.target.value)} required>
                          <option value="">Select Grade</option>
                          {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={s.formRow}>
                      <div><label style={s.label}>Previous School</label><input style={s.input} value={form.previousSchool} onChange={e=>set('previousSchool',e.target.value)} placeholder="Previous school name (if any)" /></div>
                      <div><label style={s.label}>Previous Grade</label><input style={s.input} value={form.previousGrade} onChange={e=>set('previousGrade',e.target.value)} placeholder="Last grade completed" /></div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <h2 style={s.stepTitle}>Parent / Guardian Information</h2>
                    <div style={s.formRow}>
                      <div><label style={s.label}>Parent/Guardian Name *</label><input style={s.input} value={form.parentName} onChange={e=>set('parentName',e.target.value)} placeholder="Full name" required /></div>
                      <div>
                        <label style={s.label}>Relationship *</label>
                        <select style={s.input} value={form.relationship} onChange={e=>set('relationship',e.target.value)}>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="guardian">Guardian</option>
                        </select>
                      </div>
                    </div>
                    <div style={s.formRow}>
                      <div><label style={s.label}>Email Address *</label><input style={s.input} type="email" value={form.parentEmail} onChange={e=>set('parentEmail',e.target.value)} placeholder="your@email.com" required /></div>
                      <div><label style={s.label}>Phone Number *</label><input style={s.input} type="tel" value={form.parentPhone} onChange={e=>set('parentPhone',e.target.value)} placeholder="+91 XXXXX XXXXX" required /></div>
                    </div>
                    <div><label style={s.label}>Occupation</label><input style={s.input} value={form.parentOccupation} onChange={e=>set('parentOccupation',e.target.value)} placeholder="Occupation / Profession" /></div>
                  </div>
                )}

                {step === 3 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    <h2 style={s.stepTitle}>Address & Submission</h2>
                    <div style={s.formRow}>
                      <div style={{ gridColumn:'1/-1' }}><label style={s.label}>Street Address</label><input style={s.input} value={form.address.street} onChange={e=>setAddr('street',e.target.value)} placeholder="House No., Street, Area" /></div>
                    </div>
                    <div style={s.formRow}>
                      <div><label style={s.label}>City</label><input style={s.input} value={form.address.city} onChange={e=>setAddr('city',e.target.value)} placeholder="City" /></div>
                      <div><label style={s.label}>State</label><input style={s.input} value={form.address.state} onChange={e=>setAddr('state',e.target.value)} placeholder="State" /></div>
                    </div>
                    <div style={{ width:'50%' }}><label style={s.label}>Pincode</label><input style={s.input} value={form.address.pincode} onChange={e=>setAddr('pincode',e.target.value)} placeholder="Pincode" /></div>
                    <div><label style={s.label}>Additional Message</label><textarea style={{ ...s.input, minHeight:90, resize:'vertical' }} value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Any additional information you'd like to share..." /></div>
                    <div style={{ background:'#fdf0f3', borderRadius:12, padding:'1rem', fontSize:'.85rem', color:'#7a5a64', border:'1px solid rgba(232,53,90,0.15)' }}>
                      ℹ️ By submitting this form, you confirm that all information provided is accurate. We will contact you at <strong>{form.parentEmail}</strong> within 3–5 business days.
                    </div>
                  </div>
                )}

                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'1.5rem', gap:'1rem' }}>
                  {step > 1 && (
                    <button type="button" onClick={()=>setStep(s=>s-1)} style={s.btnOutline}>← Previous</button>
                  )}
                  <button type="submit" disabled={loading} style={{ ...s.btnPrimary, marginLeft:'auto' }}>
                    {loading ? 'Submitting...' : step === 3 ? 'Submit Application' : 'Next →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  card: { background:'white', borderRadius:24, padding:'2.5rem', boxShadow:'0 20px 60px rgba(200,40,70,0.10)', border:'1px solid rgba(232,53,90,0.1)' },
  stepTitle: { fontFamily:'Playfair Display, serif', fontSize:'1.4rem', color:'#1a0a10', marginBottom:'.5rem' },
  formRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' },
  label: { display:'block', fontSize:'.83rem', fontWeight:600, color:'#2d1520', marginBottom:'.4rem' },
  input: { width:'100%', padding:'.75rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:10, fontFamily:'DM Sans, sans-serif', fontSize:'.9rem', color:'#2d1520', background:'#faf7f8', outline:'none', boxSizing:'border-box' },
  btnPrimary: { background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:12, padding:'.85rem 2rem', fontSize:'.95rem', fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif', boxShadow:'0 6px 20px rgba(232,53,90,0.3)' },
  btnOutline: { background:'transparent', color:'#e8355a', border:'2px solid rgba(232,53,90,0.3)', borderRadius:12, padding:'.85rem 2rem', fontSize:'.95rem', fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' },
};
