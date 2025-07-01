import React, { useState } from 'react';
import api, { setAuthToken } from '../api/api';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      let response;
      if (isLogin) {
        response = await api.post('/auth/login', { username, password });
        const { token } = response.data; // Giả sử API trả về { "token": "your-jwt-token" }
        setAuthToken(token); // Lưu token vào interceptor và localStorage
        onLogin(token); // Cập nhật token trong App.js
      } else {
        response = await api.post('/auth/register', { username, password, email });
        setMessage(response.data);
      }
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred');
      console.error('Login/Register error:', error.response?.data); // Debug
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-2 text-blue-500 hover:underline"
        >
          {isLogin ? 'Need to register?' : 'Already have an account? Login'}
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Auth;