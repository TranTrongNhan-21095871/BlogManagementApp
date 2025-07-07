import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Dashboard = ({ token, user, onLogout }) => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    userId: user?.id || null, 
    categoryId: '' 
  });
  const [message, setMessage] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !newPost.categoryId) {
      setNewPost(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      console.log('Fetched categories:', response.data); // Debug
      setCategories(response.data || []);
    } catch (error) {
      setMessage('Failed to fetch categories');
      console.error('Error fetching categories:', error.response?.data || error.message);
      setCategories([]);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      console.log('Fetched posts:', response.data); // Debug
      setPosts(response.data || []);
    } catch (error) {
      setMessage('Failed to fetch posts');
      console.error('Error fetching posts:', error.response?.data || error.message);
      setPosts([]);
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
      fetchCategories();
      setMessage(response.data.message || 'Category created successfully');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while creating category');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategory.name.trim()) {
      setMessage('Category name cannot be empty');
      return;
    }
    try {
      await api.put(`/categories/${editCategory.id}`, { name: editCategory.name });
      setEditCategory(null);
      fetchCategories();
      setMessage('Category updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while updating category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
        setMessage('Category deleted successfully');
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while deleting category');
      }
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
      setNewPost({ title: '', content: '', userId: user?.id || null, categoryId: '' });
      fetchPosts();
      setMessage('Post created successfully');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while creating post');
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editPost.title.trim() || !editPost.content.trim()) {
      setMessage('Title and content cannot be empty');
      return;
    }
    try {
      await api.put(`/posts/${editPost.id}`, editPost);
      setEditPost(null);
      fetchPosts();
      setMessage('Post updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred while updating post');
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        fetchPosts();
        setMessage('Post deleted successfully');
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while deleting post');
      }
    }
  };

  const handleEditPost = async (post) => {
    try {
      const updatedPost = {
        ...post,
        views: (post.views || 0) + 1,
        categoryId: post.category?.id || null
      };
      await api.put(`/posts/${post.id}`, updatedPost);
      setEditPost(updatedPost);
      fetchPosts();
    } catch (error) {
      setMessage('Failed to update views');
      console.error('Error updating views:', error.response?.data || error.message);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">{message}</div>
      )}
      <button
        onClick={onLogout}
        className="mb-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>

      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Search posts by title..."
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Create Category</h3>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
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

      {editCategory && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <input
              type="text"
              value={editCategory.name}
              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter new category name"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditCategory(null)}
                className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              {cat.name}
              <div>
                <button
                  onClick={() => setEditCategory(cat)}
                  className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Create Post</h3>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter title"
            required
          />
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter content"
            required
          />
          <select
            value={newPost.categoryId || ''}
            onChange={(e) => setNewPost({ ...newPost, categoryId: Number(e.target.value) })}
            className="w-full p-2 border border-gray-300 rounded-md"
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

      {editPost && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Edit Post</h3>
          <form onSubmit={handleUpdatePost} className="space-y-4">
            <input
              type="text"
              value={editPost.title}
              onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter new title"
              required
            />
            <textarea
              value={editPost.content}
              onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter new content"
              required
            />
            <select
              value={editPost.categoryId || ''}
              onChange={(e) => setEditPost({ ...editPost, categoryId: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditPost(null)}
                className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        <ul className="space-y-2">
          {currentPosts.map((post) => (
            <li key={post.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <Link 
                to={`/post/${post.id}`} 
                className="text-blue-500 hover:underline"
                onClick={(e) => console.log('Link clicked, post.id:', post.id)} // Debug
              >
                {post.title} (Category: {post.category?.name || 'N/A'}, Views: {post.views || 0})
              </Link>
              <div>
                <button
                  onClick={() => handleEditPost(post)}
                  className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;