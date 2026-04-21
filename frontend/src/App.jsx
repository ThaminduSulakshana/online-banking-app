import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransfersPage from './pages/TransfersPage';
import AccountsPage from './pages/AccountsPage';
import LoansPage from './pages/LoansPage';
import SupportPage from './pages/SupportPage';
import AdvertisementManagementPage from './pages/AdvertisementManagementPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

const AdminRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  const hasRole = user?.roles?.some(role => allowedRoles.includes(role));
  return hasRole ? <MainLayout>{children}</MainLayout> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/transfers" element={<PrivateRoute><TransfersPage /></PrivateRoute>} />
          <Route path="/accounts" element={<PrivateRoute><AccountsPage /></PrivateRoute>} />
          <Route path="/loans" element={<PrivateRoute><LoansPage /></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute><SupportPage /></PrivateRoute>} />
          <Route path="/admin/advertisements" element={<AdminRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ADVERTISEMENT_ADMIN']}><AdvertisementManagementPage /></AdminRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
