import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donate from './pages/Donate';
import Settings from './pages/Settings';
import AdminOverview from './pages/AdminOverview';
import AdminDonations from './pages/AdminDonations';
import AdminNGOs from './pages/AdminNGOs';
import AdminUsers from './pages/AdminUsers';
import Receipt from './pages/Receipt';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

import MainLayout from './components/MainLayout';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Register />} 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donate" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Donate />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/receipt" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Receipt />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <MainLayout>
              <AdminOverview />
            </MainLayout>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/donations" 
        element={
          <AdminRoute>
            <MainLayout>
              <AdminDonations />
            </MainLayout>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/ngos" 
        element={
          <AdminRoute>
            <MainLayout>
              <AdminNGOs />
            </MainLayout>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <MainLayout>
              <AdminUsers />
            </MainLayout>
          </AdminRoute>
        } 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
