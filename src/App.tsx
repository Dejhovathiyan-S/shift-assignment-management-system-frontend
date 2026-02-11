import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import StaffDashboard from './pages/staff/StaffDashboard';
import AvailableShifts from './pages/staff/AvailableShifts';
import MyRequests from './pages/staff/MyRequests';
import MyShifts from './pages/staff/MyShifts';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import CreateShift from './pages/manager/CreateShift';
import AllShifts from './pages/manager/AllShifts';
import PendingRequests from './pages/manager/PendingRequests';
import Assignments from './pages/manager/Assignments';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'MANAGER' ? '/manager' : '/staff'} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'MANAGER' ? '/manager' : '/staff'} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/staff" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/available-shifts" element={<ProtectedRoute allowedRoles={['STAFF']}><AvailableShifts /></ProtectedRoute>} />
        <Route path="/staff/my-requests" element={<ProtectedRoute allowedRoles={['STAFF']}><MyRequests /></ProtectedRoute>} />
        <Route path="/staff/my-shifts" element={<ProtectedRoute allowedRoles={['STAFF']}><MyShifts /></ProtectedRoute>} />

        <Route path="/manager" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/create-shift" element={<ProtectedRoute allowedRoles={['MANAGER']}><CreateShift /></ProtectedRoute>} />
        <Route path="/manager/all-shifts" element={<ProtectedRoute allowedRoles={['MANAGER']}><AllShifts /></ProtectedRoute>} />
        <Route path="/manager/pending-requests" element={<ProtectedRoute allowedRoles={['MANAGER']}><PendingRequests /></ProtectedRoute>} />
        <Route path="/manager/assignments" element={<ProtectedRoute allowedRoles={['MANAGER']}><Assignments /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', background: '#333', color: '#fff' },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
