import { useState } from 'react'
import './index.css'
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  return (
    <div className="min-h-screen bg-gray-100">
      {!token ? (
        <Auth onLogin={(token) => setToken(token)} />
      ) : (
        <Dashboard token={token} />
      )}
    </div>
  );
}

export default App
