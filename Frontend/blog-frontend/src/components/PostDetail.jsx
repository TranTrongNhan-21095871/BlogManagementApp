import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const PostDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      if (!token) {
        setMessage('No valid token, please log in again');
        navigate('/login');
        return;
      }

      const response = await api.get(`/posts/${id}`);
      setPost(response.data);

      const updatedPost = {
        ...response.data,
        views: (response.data.views || 0) + 1,
        categoryId: response.data.category?.id || null,
      };
      await api.put(`/posts/${id}`, updatedPost);
      setPost(updatedPost);
    } catch (error) {
      setMessage('Failed to fetch or update post: ' + (error.response?.data?.message || error.message));
      console.error('Error fetching/updating post:', error.response?.data || error.message);
      if (error.response?.status === 403) {
        navigate('/login'); // Chuyển hướng nếu 403
      }
    }
  };

  if (!post) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Post Details</h2>
      {message && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">{message}</div>
      )}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">{post.title}</h3>
        <p className="mb-4">{post.content}</p>
        <p className="mb-2"><strong>Category:</strong> {post.category?.name || 'N/A'}</p>
        <p className="mb-4"><strong>Views:</strong> {post.views}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PostDetail;