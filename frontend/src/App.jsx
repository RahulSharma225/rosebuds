import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import AdmissionForm from './pages/AdmissionForm';
import TrackApplication from './pages/TrackApplication';
import Dashboard     from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAdmissions from './pages/admin/AdminAdmissions';
import AdminEvents   from './pages/admin/AdminEvents';
import AdminNews     from './pages/admin/AdminNews';
import AdminContacts from './pages/admin/AdminContacts';
import AdminStudents from './pages/admin/AdminStudents';
import AdminFees     from './pages/admin/AdminFees';
import FeePayment    from './pages/FeePayment';

// Route Guards
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: 'DM Sans, sans-serif' } }} />
        <Routes>
          {/* Public */}
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/apply"       element={<AdmissionForm />} />
          <Route path="/track/:appNo?" element={<TrackApplication />} />

          {/* Parent / Student Portal */}
          <Route path="/dashboard" element={
            <PrivateRoute roles={['parent', 'student', 'admin']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/fees" element={
            <PrivateRoute roles={['parent', 'student']}>
              <FeePayment />
            </PrivateRoute>
          } />

          {/* Admin Panel */}
          <Route path="/admin" element={
            <PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/admissions" element={
            <PrivateRoute roles={['admin']}><AdminAdmissions /></PrivateRoute>
          } />
          <Route path="/admin/events" element={
            <PrivateRoute roles={['admin']}><AdminEvents /></PrivateRoute>
          } />
          <Route path="/admin/news" element={
            <PrivateRoute roles={['admin']}><AdminNews /></PrivateRoute>
          } />
          <Route path="/admin/contacts" element={
            <PrivateRoute roles={['admin']}><AdminContacts /></PrivateRoute>
          } />
          <Route path="/admin/students" element={
            <PrivateRoute roles={['admin']}><AdminStudents /></PrivateRoute>
          } />
          <Route path="/admin/fees" element={
            <PrivateRoute roles={['admin']}><AdminFees /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
