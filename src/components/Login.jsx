import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const getSubdomain = () => {
    const host = window.location.hostname;
    const parts = host.split('.');
    return parts.length > 2 ? parts[0] : null;
  };

  const fetchBranding = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/branding`);
      const data = res.data;

      setBranding(data);
      localStorage.setItem('institute_title', data.institute || '');
      localStorage.setItem('theme_color', data.theme?.color || '#10B981');
      localStorage.setItem('favicon', data.favicon || '');
      localStorage.setItem('logo', data.logo || '');

      // Set global theme
      document.documentElement.style.setProperty('--theme-color', data.theme?.color || '#10B981');

      // Set favicon
      if (data.favicon) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = data.favicon;
        document.head.appendChild(link);
      }

      // Set title
      if (data.institute) {
        document.title = `${data.institute} | Instify`;
      }
    } catch (err) {
      toast.error('Failed to load branding');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    fetchBranding();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/user/login`, {
        username,
        password
      });

      const data = res.data;
      if (data.message !== 'success') {
        toast.error(data.message || 'Invalid credentials');
        return;
      }

      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_name', data.user_name);
      localStorage.setItem('user_type', data.user_role || 'admin');
      localStorage.setItem('login_username', data.login_username);
      localStorage.setItem('institute_id', data.institute_id);
      localStorage.setItem('institute_title', data.institute_name);
      localStorage.setItem('theme_color', data.theme_color || '#10B981');

      toast.success(`Welcome, ${data.user_name}`);
      setTimeout(() => {
        navigate(`/${data.login_username}`); // Redirect to user dashboard
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img
            src={branding?.logo || '/logo.png'}
            alt="Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: branding?.theme?.color || '#10B981' }}
        >
          {branding?.institute || 'Login'}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading institute...</p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-700">Username</label>
              <input
                ref={inputRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none"
                placeholder="Enter password"
              />
            </div>

            <div className="text-right text-sm">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded text-white"
              style={{ backgroundColor: branding?.theme?.color || '#10B981' }}
            >
              Login
            </button>
          </form>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?
          <button
            onClick={() => navigate('/signup')}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
