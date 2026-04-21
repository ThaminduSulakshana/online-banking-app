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

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
