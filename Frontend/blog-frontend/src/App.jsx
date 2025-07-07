import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PostDetail from './components/PostDetail';
import api, { setAuthToken } from './api/api';

function App() {
  const [authData, setAuthData] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || null),
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      console.log('Validating token:', token); // Debug
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const response = await api.get('/auth/validate-token');
        console.log('Validate response:', response.data);
        const userResponse = await api.get('/auth/me');
        setAuthData({
          token,
          user: userResponse.data,
          isAuthenticated: true
        });
      } catch (error) {
        console.error('Token validation error:', error.response?.data || error.message, error.response?.status);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthData({
            token: null,
            user: null,
            isAuthenticated: false
          });
          window.location.href = '/login';
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthData({
            token: null,
            user: null,
            isAuthenticated: false
          });
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleLogin = async (token) => {
    setAuthToken(token);
    try {
      console.log('Login successful, token:', token); // Debug
      const userResponse = await api.get('/auth/me');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      setAuthData({
        token,
        user: userResponse.data,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthData({
        token: null,
        user: null,
        isAuthenticated: false
      });
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthData({
      token: null,
      user: null,
      isAuthenticated: false
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !authData.isAuthenticated ? 
              <Auth onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            authData.isAuthenticated ? 
              <Dashboard 
                token={authData.token} 
                user={authData.user} 
                onLogout={handleLogout} 
              /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/post/:id" 
          element={
            authData.isAuthenticated ? 
              <PostDetail token={authData.token} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={authData.isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;