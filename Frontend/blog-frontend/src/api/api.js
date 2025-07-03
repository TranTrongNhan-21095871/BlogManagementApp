import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let token = null; // Biến lưu token

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm để đặt token
export const setAuthToken = (newToken) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken); // Lưu token vào localStorage
  } else {
    localStorage.removeItem('token'); // Xóa token nếu null
  }
};

// Khởi tạo token từ localStorage khi load
const storedToken = localStorage.getItem('token');
if (storedToken) {
  setAuthToken(storedToken);
}

export default api;