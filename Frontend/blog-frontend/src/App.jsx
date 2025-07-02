import { useState, useEffect } from 'react';
import './index.css';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);

  // Kiểm tra token khi ứng dụng khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Gửi request kiểm tra token (giả định endpoint /api/validate-token)
      fetch('http://localhost:8080/api/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
        .then(response => {
          if (!response.ok) {
            localStorage.removeItem('token');
            throw new Error('Token invalid');
          }
          return response.json();
        })
        .then(() => setToken(storedToken))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {!token ? (
        <Auth onLogin={(token) => {
          localStorage.setItem('token', token);
          setToken(token);
        }} />
      ) : (
        <Dashboard token={token} onLogout={() => {
          localStorage.removeItem('token');
          setToken(null);
        }} />
      )}
    </div>
  );
}

export default App;