import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get('/events?upcoming=true').then(({ data }) => setEvents(data.events?.slice(0, 3) || [])).catch(() => {});
    api.get('/news?limit=3').then(({ data }) => setNews(data.news || [])).catch(() => {});
  }, []);

  // Fade-in on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'translateY(0)'; } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [events, news]);

  const CATEGORY_COLOR = { academic:'#3b82f6', cultural:'#8b5cf6', sports:'#22c55e', holiday:'#f59e0b', admission:'#e8355a', exam:'#ef4444', other:'#9ca3af' };
  const CAT_COLOR = { news:'#3b82f6', announcement:'#f59e0b', achievement:'#22c55e', circular:'#8b5cf6' };

  return (
    <>
      <Navbar />
      <div style={{ fontFamily:'DM Sans, sans-serif', overflowX:'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:72, position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#fff9fa 0%,#fdf0f3 50%,#fff5f0 100%)' }}>
          {/* Floating petals */}
          {[
            { w:300, h:300, top:'-80px', right:'10%', delay:'0s', br:'50% 0 50% 0' },
            { w:180, h:180, top:'40%', right:'-40px', delay:'2s', br:'0 50% 0 50%' },
            { w:220, h:220, bottom:'-60px', left:'5%', delay:'4s', br:'50% 0 50% 0', op:.6 },
            { w:120, h:120, top:'20%', left:'20%', delay:'1s', br:'0 50% 0 50%', op:.4 },
          ].map((p, i) => (
            <div key={i} style={{ position:'absolute', width:p.w, height:p.h, top:p.top, bottom:p.bottom, left:p.left, right:p.right, borderRadius:p.br, background:'linear-gradient(135deg,rgba(232,53,90,0.08),rgba(212,168,67,0.06))', animation:`floatPetal 8s ease-in-out ${p.delay} infinite`, opacity:p.op||1, pointerEvents:'none' }} />
          ))}
          <style>{`@keyframes floatPetal{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(10px,-15px) rotate(5deg)}66%{transform:translate(-8px,8px) rotate(-3deg)}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}}`}</style>

          <div style={{ maxWidth:1200, margin:'auto', padding:'5rem 2rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', position:'relative', zIndex:1, width:'100%' }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'white', border:'1px solid rgba(232,53,90,0.15)', padding:'.4rem 1rem', borderRadius:100, marginBottom:'1.5rem', boxShadow:'0 2px 12px rgba(232,53,90,0.08)' }}>
                <div style={{ width:8, height:8, background:'#e8355a', borderRadius:'50%', animation:'pulse 2s infinite' }} />
                <span style={{ fontSize:'.8rem', fontWeight:700, color:'#e8355a', textTransform:'uppercase', letterSpacing:'.08em' }}>Est. Since 1995 · 30 Years of Excellence</span>
              </div>
              <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(2.4rem,5vw,3.8rem)', color:'#1a0a10', marginBottom:'1.2rem', lineHeight:1.2 }}>
                Where Young Minds <em style={{ fontStyle:'italic', color:'#e8355a' }}>Blossom</em> Into Brilliance
              </h1>
              <p style={{ fontSize:'1.05rem', color:'#7a5a64', lineHeight:1.7, marginBottom:'2.5rem', maxWidth:480 }}>
                Rose Buds Public School offers holistic education from Pre-Nursery to Grade 10, nurturing every child's potential in a warm, inspiring environment.
              </p>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                <Link to="/apply" style={{ background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', padding:'.9rem 2rem', borderRadius:100, fontWeight:700, textDecoration:'none', boxShadow:'0 6px 24px rgba(232,53,90,0.35)', fontSize:'.95rem', transition:'transform .2s' }}>Apply for Admission →</Link>
                <a href="#about" style={{ background:'transparent', color:'#e8355a', border:'2px solid rgba(232,53,90,0.3)', padding:'.9rem 2rem', borderRadius:100, fontWeight:700, textDecoration:'none', fontSize:'.95rem' }}>Discover Our School</a>
              </div>
              <div style={{ display:'flex', gap:'2rem', marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid rgba(232,53,90,0.12)' }}>
                {[['1200+','Students'],['80+','Faculty'],['98%','Pass Rate'],['30yrs','Legacy']].map(([v,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:'Playfair Display, serif', fontSize:'1.8rem', color:'#e8355a', fontWeight:700 }}>{v}</div>
                    <div style={{ fontSize:'.78rem', color:'#7a5a64', textTransform:'uppercase', letterSpacing:'.06em' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position:'relative' }}>
              <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 30px 80px rgba(200,40,70,0.18)' }}>
                <img src="https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="Students" style={{ width:'100%', height:400, objectFit:'cover', display:'block' }} loading="lazy" />
              </div>
              <div style={{ position:'absolute', bottom:-24, left:-24, background:'white', borderRadius:16, padding:'1.2rem 1.5rem', boxShadow:'0 12px 40px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, background:'#fdf0f3', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏆</div>
                <div><div style={{ fontWeight:700, color:'#1a0a10' }}>Top Ranked</div><div style={{ fontSize:'.78rem', color:'#7a5a64' }}>District School 2024</div></div>
              </div>
              <div style={{ position:'absolute', top:24, right:-20, background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', borderRadius:16, padding:'1rem 1.3rem', textAlign:'center', boxShadow:'0 8px 30px rgba(232,53,90,0.35)' }}>
                <div style={{ fontFamily:'Playfair Display, serif', fontSize:'1.5rem', fontWeight:700 }}>A+</div>
                <div style={{ fontSize:'.75rem', opacity:.9 }}>CBSE Affiliation</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ padding:'5rem 0', background:'#faf7f8' }}>
          <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem' }}>
            <div className="fade" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              <div style={{ position:'relative', height:380 }}>
                <div style={{ width:'75%', borderRadius:20, overflow:'hidden', boxShadow:'0 20px 60px rgba(200,40,70,0.15)' }}>
                  <img src="https://images.unsplash.com/photo-1763637675793-da207ba1fe18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" alt="School" style={{ width:'100%', height:320, objectFit:'cover', display:'block' }} loading="lazy" />
                </div>
                <div style={{ position:'absolute', bottom:-30, right:0, width:'55%', borderRadius:16, overflow:'hidden', boxShadow:'0 16px 50px rgba(0,0,0,0.14)', border:'4px solid white' }}>
                  <img src="https://images.unsplash.com/photo-1758270704021-361c165d68fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" alt="Classroom" style={{ width:'100%', height:180, objectFit:'cover', display:'block' }} loading="lazy" />
                </div>
                <div style={{ position:'absolute', top:20, right:0, background:'#d4a843', color:'white', borderRadius:12, padding:'.8rem 1.2rem', textAlign:'center', boxShadow:'0 8px 24px rgba(212,168,67,0.4)' }}>
                  <div style={{ fontFamily:'Playfair Display, serif', fontSize:'1.6rem', fontWeight:700 }}>30+</div>
                  <div style={{ fontSize:'.72rem', textTransform:'uppercase', letterSpacing:'.06em', opacity:.9 }}>Awards Won</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#e8355a', marginBottom:'.8rem' }}>Our Story</div>
                <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#1a0a10', marginBottom:'1rem' }}>A Legacy of Learning & Character</h2>
                <p style={{ color:'#7a5a64', lineHeight:1.7, marginBottom:'1.5rem' }}>Founded in 1995, Rose Buds Public School has grown into one of the region's most trusted institutions. We believe every child carries the seed of greatness — our role is to help it bloom.</p>
                {[
                  { icon:'📖', title:'Academic Excellence', desc:'Rigorous curriculum aligned with CBSE standards, fostering critical thinking and a love for learning.' },
                  { icon:'🌿', title:'Holistic Development', desc:'Beyond textbooks — sports, arts, music, and leadership programs to develop well-rounded individuals.' },
                  { icon:'❤️', title:'Safe & Nurturing Environment', desc:'A caring, inclusive community where every child feels valued, safe, and inspired to give their best.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{ display:'flex', gap:'1rem', marginBottom:'1.2rem', alignItems:'flex-start' }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:'#fdf0f3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{icon}</div>
                    <div>
                      <div style={{ fontWeight:700, color:'#1a0a10', marginBottom:'.25rem' }}>{title}</div>
                      <div style={{ color:'#7a5a64', fontSize:'.9rem', lineHeight:1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ACADEMICS ── */}
        <section id="academics" style={{ padding:'5rem 0', background:'white' }}>
          <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem' }}>
            <div className="fade" style={{ textAlign:'center', marginBottom:'3.5rem', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#e8355a', marginBottom:'.8rem' }}>Academic Programs</div>
              <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#1a0a10', marginBottom:'1rem' }}>From First Steps to Board Exams</h2>
              <p style={{ color:'#7a5a64', maxWidth:580, margin:'0 auto' }}>Carefully designed programs for every stage of childhood — nurturing curiosity and preparing confident young adults.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
              {[
                { emoji:'🌱', title:'Pre-Nursery', desc:'Sensory play, social bonding, and early language skills in a warm, loving setting.', tag:'Ages 2–3' },
                { emoji:'🌸', title:'Nursery & LKG', desc:'Phonics, basic numeracy, rhymes, and creative play — building the foundation for lifelong learning.', tag:'Ages 3–5' },
                { emoji:'🎒', title:'UKG & Grade 1', desc:'Reading, writing, and arithmetic in a structured yet playful environment.', tag:'Ages 5–7' },
                { emoji:'📚', title:'Grade 2 – 5', desc:'Core subjects deepen with science projects, social studies, art, and physical education.', tag:'Primary School' },
                { emoji:'🔬', title:'Grade 6 – 8', desc:'Advanced concepts, lab experiments, competitive activities, and leadership opportunities.', tag:'Middle School' },
                { emoji:'🏆', title:'Grade 9 – 10', desc:'Board exam preparation with expert coaching, mock tests, and career guidance.', tag:'Secondary School' },
              ].map(({ emoji, title, desc, tag }, i) => (
                <div key={title} className="fade" style={{ background:'white', border:'1px solid rgba(232,53,90,0.12)', borderRadius:20, padding:'1.8rem', transition:'transform .3s, box-shadow .3s, opacity .7s', opacity:0, transform:'translateY(24px)', transitionDelay:`${i*0.08}s`, cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 50px rgba(200,40,70,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                  <span style={{ fontSize:'2.5rem', marginBottom:'1rem', display:'block' }}>{emoji}</span>
                  <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.1rem', color:'#1a0a10', marginBottom:'.5rem' }}>{title}</h3>
                  <p style={{ fontSize:'.88rem', color:'#7a5a64', lineHeight:1.6 }}>{desc}</p>
                  <span style={{ display:'inline-block', marginTop:'.8rem', padding:'.25rem .75rem', background:'#fdf0f3', color:'#e8355a', borderRadius:100, fontSize:'.75rem', fontWeight:700 }}>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FACILITIES ── */}
        <section id="facilities" style={{ padding:'5rem 0', background:'#faf7f8' }}>
          <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem' }}>
            <div className="fade" style={{ textAlign:'center', marginBottom:'3.5rem', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#e8355a', marginBottom:'.8rem' }}>Campus & Facilities</div>
              <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#1a0a10', marginBottom:'1rem' }}>World-Class Learning Spaces</h2>
              <p style={{ color:'#7a5a64', maxWidth:580, margin:'0 auto' }}>Modern infrastructure built to inspire — every corner of our campus is designed to spark curiosity and support growth.</p>
            </div>
            <div className="fade" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              {[
                { img:'https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', title:'Smart Classrooms', desc:'Interactive digital boards & air-conditioned rooms' },
                { img:'https://images.unsplash.com/photo-1566314748936-ad5426525f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', title:'Expansive Library', desc:'10,000+ books, journals & digital resources' },
                { img:'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', title:'Computer Labs', desc:'High-speed internet & 60+ workstations' },
                { img:'https://images.unsplash.com/photo-1764645362980-08d8704fd102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', title:'Green Campus', desc:'5-acre campus with gardens & sports grounds' },
              ].map(({ img, title, desc }) => (
                <div key={title} style={{ borderRadius:20, overflow:'hidden', position:'relative', cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 20px 50px rgba(200,40,70,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}>
                  <img src={img} alt={title} style={{ width:'100%', height:240, objectFit:'cover', display:'block', transition:'transform .5s' }} loading="lazy" />
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top,rgba(26,10,16,0.9),transparent)', padding:'2rem 1.5rem 1.5rem' }}>
                    <h3 style={{ color:'white', fontFamily:'Playfair Display, serif', marginBottom:'.3rem' }}>{title}</h3>
                    <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'.83rem' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="fade" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginTop:'1.5rem', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              {[['🔬','Science Labs','Physics, Chemistry & Bio'],['⚽','Sports Complex','Indoor & outdoor facilities'],['🎭','Auditorium','500-seat hall'],['🚌','Safe Transport','GPS-tracked buses']].map(([icon,title,desc]) => (
                <div key={title} style={{ textAlign:'center', background:'white', borderRadius:16, padding:'1.2rem 1rem', border:'1px solid rgba(232,53,90,0.1)' }}>
                  <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{icon}</div>
                  <div style={{ fontWeight:700, fontSize:'.88rem', color:'#1a0a10', marginBottom:'.2rem' }}>{title}</div>
                  <div style={{ fontSize:'.75rem', color:'#7a5a64' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EVENTS (live from API) ── */}
        <section id="events" style={{ padding:'5rem 0', background:'#1a0a10' }}>
          <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem' }}>
            <div className="fade" style={{ textAlign:'center', marginBottom:'3.5rem', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#d4a843', marginBottom:'.8rem' }}>School Life</div>
              <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'white', marginBottom:'1rem' }}>Upcoming Events</h2>
              <p style={{ color:'rgba(255,255,255,0.55)', maxWidth:580, margin:'0 auto' }}>Stay connected with all the exciting happenings at Rose Buds.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
              {events.length > 0 ? events.map((ev, i) => (
                <div key={ev._id} className="fade" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'1.8rem', opacity:0, transform:'translateY(24px)', transition:`opacity .7s, transform .7s`, transitionDelay:`${i*0.1}s` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1rem' }}>
                    <div style={{ background:'#e8355a', borderRadius:10, padding:'.4rem .7rem', textAlign:'center', lineHeight:1.1 }}>
                      <div style={{ fontWeight:700, fontSize:'1.2rem', color:'white' }}>{new Date(ev.date).getDate()}</div>
                      <div style={{ fontSize:'.65rem', textTransform:'uppercase', letterSpacing:'.06em', color:'rgba(255,255,255,0.85)' }}>{new Date(ev.date).toLocaleString('default',{month:'short'})}</div>
                    </div>
                    <span style={{ fontSize:'.75rem', fontWeight:700, color:'#d4a843', textTransform:'uppercase', letterSpacing:'.08em' }}>{ev.category}</span>
                  </div>
                  <h3 style={{ fontFamily:'Playfair Display, serif', color:'white', marginBottom:'.5rem', fontSize:'1rem' }}>{ev.title}</h3>
                  <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'.85rem', lineHeight:1.6 }}>{ev.description?.slice(0,100)}...</p>
                  {ev.location && <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'.78rem', marginTop:'.5rem' }}>📍 {ev.location}</p>}
                </div>
              )) : (
                // Fallback static events
                [
                  { day:15, month:'Jun', type:'Cultural', title:'Annual Day & Cultural Fest', desc:'A grand celebration of talent with performances, awards, and exhibitions.' },
                  { day:22, month:'Jun', type:'Academic', title:'Science Olympiad 2026', desc:'Inter-school science competition where our bright minds compete and shine.' },
                  { day:1, month:'Jul', type:'Admissions', title:'Open House Day 2026–27', desc:'Visit our campus, meet faculty, and get all admissions queries answered.' },
                ].map((ev, i) => (
                  <div key={i} className="fade" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'1.8rem', opacity:0, transform:'translateY(24px)', transition:`opacity .7s, transform .7s`, transitionDelay:`${i*0.1}s` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1rem' }}>
                      <div style={{ background:'#e8355a', borderRadius:10, padding:'.4rem .7rem', textAlign:'center', lineHeight:1.1 }}>
                        <div style={{ fontWeight:700, fontSize:'1.2rem', color:'white' }}>{ev.day}</div>
                        <div style={{ fontSize:'.65rem', textTransform:'uppercase', color:'rgba(255,255,255,0.85)' }}>{ev.month}</div>
                      </div>
                      <span style={{ fontSize:'.75rem', fontWeight:700, color:'#d4a843', textTransform:'uppercase' }}>{ev.type}</span>
                    </div>
                    <h3 style={{ fontFamily:'Playfair Display, serif', color:'white', marginBottom:'.5rem', fontSize:'1rem' }}>{ev.title}</h3>
                    <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'.85rem', lineHeight:1.6 }}>{ev.desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── NEWS ── */}
        {news.length > 0 && (
          <section style={{ padding:'5rem 0', background:'white' }}>
            <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem' }}>
              <div className="fade" style={{ textAlign:'center', marginBottom:'3.5rem', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
                <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#e8355a', marginBottom:'.8rem' }}>Latest Updates</div>
                <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#1a0a10' }}>News & Announcements</h2>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
                {news.map((n, i) => (
                  <div key={n._id} className="fade" style={{ background:'white', border:'1px solid rgba(232,53,90,0.1)', borderRadius:20, padding:'1.5rem', opacity:0, transform:'translateY(24px)', transition:`opacity .7s, transform .7s`, transitionDelay:`${i*0.1}s` }}>
                    {n.isPinned && <div style={{ fontSize:'.75rem', color:'#e8355a', marginBottom:'.5rem' }}>📌 Pinned</div>}
                    <span style={{ padding:'.2rem .75rem', borderRadius:100, background: CAT_COLOR[n.category]+'18', color: CAT_COLOR[n.category], fontSize:'.72rem', fontWeight:700, textTransform:'uppercase', display:'inline-block', marginBottom:'.75rem' }}>{n.category}</span>
                    <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'.5rem', fontSize:'1rem' }}>{n.title}</h3>
                    <p style={{ color:'#7a5a64', fontSize:'.85rem', lineHeight:1.6 }}>{n.excerpt || n.content?.slice(0,120)}...</p>
                    <div style={{ fontSize:'.78rem', color:'#9ca3af', marginTop:'.75rem' }}>{new Date(n.publishedAt).toLocaleDateString('en-IN',{dateStyle:'medium'})}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT ── */}
        <section id="contact" style={{ padding:'5rem 0', background:'#faf7f8' }}>
          <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem' }}>
            <div className="fade" style={{ textAlign:'center', marginBottom:'3.5rem', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', color:'#e8355a', marginBottom:'.8rem' }}>Get In Touch</div>
              <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#1a0a10', marginBottom:'1rem' }}>Admissions & Enquiries</h2>
              <p style={{ color:'#7a5a64', maxWidth:580, margin:'0 auto' }}>We'd love to welcome your child into the Rose Buds family.</p>
            </div>
            <div className="fade" style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:'4rem', alignItems:'start', opacity:0, transform:'translateY(24px)', transition:'opacity .7s, transform .7s' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                {[
                  { icon:'📍', label:'Our Address', val:'123 Education Street, School District\nCity Name – 123 456' },
                  { icon:'📞', label:'Phone Numbers', val:'+91 98765 43210 (Main)\n+91 98765 43211 (Admissions)' },
                  { icon:'✉️', label:'Email', val:'info@rosebudspublicschool.edu\nadmissions@rosebudspublicschool.edu' },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                    <div style={{ width:50, height:50, background:'#fdf0f3', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
                    <div><div style={{ fontWeight:700, color:'#1a0a10', marginBottom:'.25rem' }}>{label}</div><div style={{ color:'#7a5a64', fontSize:'.9rem', lineHeight:1.6, whiteSpace:'pre-line' }}>{val}</div></div>
                  </div>
                ))}
                <div style={{ background:'linear-gradient(135deg,#e8355a,#c0234a)', borderRadius:20, padding:'1.5rem', color:'white' }}>
                  <h4 style={{ marginBottom:'1rem' }}>Office Hours</h4>
                  {[['Mon – Fri','8:00 AM – 3:00 PM'],['Saturday','8:00 AM – 12:00 PM'],['Sunday','Closed']].map(([day,time]) => (
                    <div key={day} style={{ display:'flex', justifyContent:'space-between', fontSize:'.88rem', padding:'.4rem 0', borderBottom:'1px solid rgba(255,255,255,0.15)' }}>
                      <span>{day}</span><strong>{time}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background:'#1a0a10', color:'rgba(255,255,255,0.65)', padding:'4rem 0 2rem' }}>
          <div style={{ maxWidth:1200, margin:'auto', padding:'0 2rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:'3rem', marginBottom:'3rem' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1rem' }}>
                  <div style={{ width:40, height:40, background:'linear-gradient(135deg,#e8355a,#c0234a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🌹</div>
                  <div>
                    <div style={{ color:'white', fontFamily:'Playfair Display, serif', fontWeight:700 }}>Rose Buds Public School</div>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'.65rem', textTransform:'uppercase', letterSpacing:'.08em' }}>Nurturing Young Minds</div>
                  </div>
                </div>
                <p style={{ fontSize:'.88rem', lineHeight:1.7 }}>Shaping futures since 1995. A community where knowledge, character, and creativity grow together.</p>
              </div>
              {[
                { title:'Quick Links', links:[['Home','/#'],['About','/#about'],['Academics','/#academics'],['Facilities','/#facilities'],['Events','/#events'],['Contact','/#contact']] },
                { title:'Admissions', links:[['Apply Now','/apply'],['Track Application','/track'],['Register','/register'],['Login','/login']] },
                { title:'Portal', links:[['Parent Login','/login'],['Student Login','/login'],['Admin Panel','/admin'],['Pay Fees','/fees']] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <h5 style={{ fontFamily:'DM Sans, sans-serif', fontWeight:700, color:'white', marginBottom:'1.2rem', fontSize:'.88rem', textTransform:'uppercase', letterSpacing:'.06em' }}>{title}</h5>
                  {links.map(([label, to]) => (
                    <Link key={label} to={to} style={{ display:'block', color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:'.88rem', marginBottom:'.6rem', transition:'color .2s' }}
                      onMouseEnter={e=>e.target.style.color='#e8355a'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.55)'}>{label}</Link>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'.82rem', flexWrap:'wrap', gap:'1rem' }}>
              <p>© 2026 Rose Buds Public School. All rights reserved.</p>
              <p>Made with ❤️ for education</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', form);
      setDone(true);
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'.8rem 1rem', border:'1.5px solid rgba(232,53,90,0.2)', borderRadius:12, fontFamily:'DM Sans, sans-serif', fontSize:'.92rem', color:'#2d1520', background:'#faf7f8', outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'.85rem', fontWeight:600, color:'#2d1520', marginBottom:'.4rem' };

  if (done) return (
    <div style={{ background:'white', borderRadius:24, padding:'3rem', textAlign:'center', boxShadow:'0 20px 60px rgba(200,40,70,0.10)', border:'1px solid rgba(232,53,90,0.1)' }}>
      <div style={{ fontSize:60, marginBottom:'1rem' }}>✅</div>
      <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'.5rem' }}>Message Sent!</h3>
      <p style={{ color:'#7a5a64' }}>We'll get back to you within 1–2 business days.</p>
      <button onClick={() => setDone(false)} style={{ marginTop:'1.5rem', background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:12, padding:'.75rem 2rem', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontWeight:600 }}>Send Another</button>
    </div>
  );

  return (
    <div style={{ background:'white', borderRadius:24, padding:'2.5rem', boxShadow:'0 20px 60px rgba(200,40,70,0.10)', border:'1px solid rgba(232,53,90,0.1)' }}>
      <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.4rem', color:'#1a0a10', marginBottom:'1.5rem' }}>Send Us a Message</h3>
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div><label style={lbl}>Your Name</label><input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" required /></div>
          <div><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 XXXXX XXXXX" /></div>
        </div>
        <div><label style={lbl}>Email Address</label><input style={inp} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required /></div>
        <div><label style={lbl}>Subject</label><input style={inp} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Admission enquiry" required /></div>
        <div><label style={lbl}>Message</label><textarea style={{ ...inp, minHeight:110, resize:'vertical' }} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Your message here..." required /></div>
        <button type="submit" disabled={loading} style={{ background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:12, padding:'1rem', fontSize:'1rem', fontWeight:700, cursor:'pointer', fontFamily:'DM Sans, sans-serif', boxShadow:'0 6px 24px rgba(232,53,90,0.35)' }}>
          {loading ? 'Sending...' : 'Send Message ✉️'}
        </button>
      </form>
    </div>
  );
}
