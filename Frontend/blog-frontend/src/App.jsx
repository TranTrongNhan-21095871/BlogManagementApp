import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PostDetail from './components/PostDetail';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetch('http://localhost:8080/api/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      })
        .then(response => {
          if (!response.ok) throw new Error('Token invalid');
          return response.json();
        })
        .then(() => setToken(storedToken))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null); // Xóa token nếu không hợp lệ
          console.error('Token validation failed, redirecting to login');
        });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {!token ? (
            <Route path="/login" element={<Auth onLogin={(token) => { localStorage.setItem('token', token); setToken(token); }} />} />
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null); }} />} />
              <Route path="/post/:id" element={<PostDetail token={token} />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </>
          )}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;