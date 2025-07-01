import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Dashboard = ({ token, onLogout }) => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', userId: 1, categoryId: 1 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      setMessage('Failed to fetch categories');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      setMessage('Failed to fetch posts');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setMessage('Category name cannot be empty');
      return;
    }
    try {
      const response = await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories(); // Cập nhật danh sách danh mục
      setMessage('Category created successfully');
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred while creating category');
      console.error('Create category error:', error.response?.data || error.message);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setMessage('Title and content cannot be empty');
      return;
    }
    try {
      const response = await api.post('/posts', newPost);
      setNewPost({ title: '', content: '', userId: 1, categoryId: 1 });
      fetchPosts(); // Cập nhật danh sách bài viết
      setMessage('Post created successfully');
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred while creating post');
      console.error('Create post error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <button
        onClick={onLogout}
        className="mb-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Create Category</h3>
        <form onSubmit={handleCreateCategory} className="space-y-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter category name"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Create Category
          </button>
        </form>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Create Post</h3>
        <form onSubmit={handleCreatePost} className="space-y-2">
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter title"
            required
          />
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter content"
            required
          />
          <select
            value={newPost.categoryId}
            onChange={(e) => setNewPost({ ...newPost, categoryId: Number(e.target.value) })}
            className="block w-full border-gray-300 rounded-md shadow-sm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Create Post
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Categories</h3>
        <ul className="list-disc pl-5">
          {categories.map((cat) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Posts</h3>
        <ul className="list-disc pl-5">
          {posts.map((post) => (
            <li key={post.id}>{post.title} (Category: {post.category.name})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;