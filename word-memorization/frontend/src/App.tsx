import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Report from './pages/Report';
import WordAdd from './modules/WordAdd/WordAdd';
import Quiz from './modules/Quiz/Quiz';
import Wordle from './modules/Wordle/Wordle';
import WordChain from './modules/WordChain/WordChain';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

// Auth context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Box>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/word-add" element={<ProtectedRoute><WordAdd /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/wordle" element={<ProtectedRoute><Wordle /></ProtectedRoute>} />
            <Route path="/word-chain" element={<ProtectedRoute><WordChain /></ProtectedRoute>} />
            {/* Dashboard, Ayarlar, Rapor ve korumalı route'lar eklenecek */}
            <Route path="*" element={<Login />} />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  );
};

// Navbar bileşeni
const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Kelime Ezberleme Sistemi
        </Typography>
        {!isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/login">Giriş Yap</Button>
            <Button color="inherit" component={Link} to="/register">Kayıt Ol</Button>
            <Button color="inherit" component={Link} to="/reset-password">Şifremi Unuttum</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/dashboard">Ana Sayfa</Button>
            <Button color="inherit" component={Link} to="/settings">Ayarlar</Button>
            <Button color="inherit" component={Link} to="/report">Rapor</Button>
            <Button color="inherit" onClick={handleLogout}>Çıkış Yap</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

// ProtectedRoute bileşeni
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);
  return <>{isAuthenticated ? children : null}</>;
};

export default App;
