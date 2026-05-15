import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const STATUS_BADGE = { pending:'#f59e0b', paid:'#22c55e', overdue:'#ef4444', partial:'#3b82f6', waived:'#8b5cf6' };

export default function FeePayment() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fees').then(({ data }) => setFees(data.fees || [])).catch(()=>toast.error('Failed to load fees')).finally(()=>setLoading(false));
  }, []);

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePayFee = async (fee) => {
    const loaded = await loadRazorpay();
    if (!loaded) return toast.error('Payment service unavailable');
    try {
      const { data } = await api.post(`/fees/${fee._id}/create-order`);
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Rose Buds Public School',
        description: `${fee.feeType} Fee – ${fee.academicYear}`,
        order_id: data.order.id,
        image: 'https://via.placeholder.com/150/e8355a/ffffff?text=RB',
        handler: async (response) => {
          try {
            await api.post(`/fees/${fee._id}/verify-payment`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful! 🎉');
            setFees(prev => prev.map(f => f._id === fee._id ? { ...f, status:'paid' } : f));
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: fee.studentName, email: '', contact: '' },
        theme: { color: '#e8355a' },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment');
    }
  };

  const pending = fees.filter(f => f.status === 'pending' || f.status === 'overdue');
  const paid = fees.filter(f => f.status === 'paid');

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'100vh', background:'#f8f5f6', paddingTop:90, fontFamily:'DM Sans, sans-serif' }}>
        <div style={{ maxWidth:800, margin:'auto', padding:'2rem 1.5rem' }}>
          <div style={{ marginBottom:'2rem' }}>
            <Link to="/dashboard" style={{ color:'#7a5a64', textDecoration:'none', fontSize:'.88rem' }}>← Dashboard</Link>
            <h1 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.8rem', color:'#1a0a10', marginTop:'.5rem' }}>Fee Payment</h1>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'#7a5a64' }}>Loading fees...</div>
          ) : (
            <>
              {pending.length > 0 && (
                <div style={{ background:'white', borderRadius:20, padding:'1.5rem', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
                  <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1.2rem' }}>Pending Payments</h3>
                  {pending.map(fee => (
                    <div key={fee._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem', marginBottom:'.75rem', background:'#fef2f2', borderRadius:12, border:'1px solid rgba(239,68,68,0.2)' }}>
                      <div>
                        <div style={{ fontWeight:600, color:'#2d1520', textTransform:'capitalize' }}>{fee.feeType} Fee</div>
                        <div style={{ fontSize:'.8rem', color:'#7a5a64' }}>{fee.academicYear} · {fee.grade} · Due: {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-IN') : 'N/A'}</div>
                        <span style={{ display:'inline-block', marginTop:'.3rem', padding:'.15rem .6rem', borderRadius:100, background: STATUS_BADGE[fee.status]+'20', color: STATUS_BADGE[fee.status], fontSize:'.72rem', fontWeight:600, textTransform:'capitalize' }}>{fee.status}</span>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:'Playfair Display, serif', fontSize:'1.3rem', fontWeight:700, color:'#ef4444', marginBottom:'.5rem' }}>₹{fee.amount.toLocaleString()}</div>
                        <button onClick={() => handlePayFee(fee)} style={{ background:'linear-gradient(135deg,#e8355a,#c0234a)', color:'white', border:'none', borderRadius:8, padding:'.5rem 1.2rem', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontWeight:600, fontSize:'.85rem' }}>
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {paid.length > 0 && (
                <div style={{ background:'white', borderRadius:20, padding:'1.5rem', boxShadow:'0 4px 20px rgba(200,40,70,0.07)', border:'1px solid rgba(232,53,90,0.08)' }}>
                  <h3 style={{ fontFamily:'Playfair Display, serif', color:'#1a0a10', marginBottom:'1.2rem' }}>Payment History</h3>
                  {paid.map(fee => (
                    <div key={fee._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.75rem 1rem', marginBottom:'.5rem', background:'#f0fdf4', borderRadius:10, border:'1px solid rgba(34,197,94,0.2)' }}>
                      <div>
                        <div style={{ fontWeight:600, color:'#2d1520', textTransform:'capitalize' }}>{fee.feeType} Fee – {fee.academicYear}</div>
                        <div style={{ fontSize:'.8rem', color:'#7a5a64' }}>Paid: {fee.paidAt ? new Date(fee.paidAt).toLocaleDateString('en-IN') : 'N/A'} · TXN: {fee.transactionId || 'N/A'}</div>
                      </div>
                      <div style={{ fontWeight:700, color:'#22c55e', fontFamily:'Playfair Display, serif', fontSize:'1.2rem' }}>₹{fee.amount.toLocaleString()} ✓</div>
                    </div>
                  ))}
                </div>
              )}

              {fees.length === 0 && (
                <div style={{ textAlign:'center', background:'white', borderRadius:20, padding:'3rem', color:'#7a5a64' }}>
                  <div style={{ fontSize:48, marginBottom:'1rem' }}>📋</div>
                  <p>No fee records found. Contact your school administrator.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
