import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState(null);
  const [loadingOrg, setLoadingOrg] = useState(false);
  const nameInputRef = useRef(null);

  const getSubdomain = () => {
    const host = window.location.hostname;
    const parts = host.split('.');
    return parts.length > 2 ? parts[0] : null;
  };

  useEffect(() => {
    nameInputRef.current?.focus();

    const themeColor = localStorage.getItem('theme_color') || '#10B981';
    document.documentElement.style.setProperty('--theme-color', themeColor);

    const subdomain = getSubdomain();

    if (subdomain) {
      setLoadingOrg(true);

      axios
        .get(`${BASE_URL}/api/resolve-org?subdomain=${subdomain}`)
        .then((res) => {
          const org = res.data.institute;
          if (org && org._id) {
            setOrgId(org._id);
            localStorage.setItem('institute_id', org._id);
            localStorage.setItem('institute_title', org.institute_title);
            localStorage.setItem('theme_color', org.theme_color || '#10B981');
            document.documentElement.style.setProperty('--theme-color', org.theme_color || '#10B981');
          } else {
            toast.error('institute not found');
          }
        })
        .catch(() => {
          toast.error('Invalid subdomain');
        })
        .finally(() => {
          setLoadingOrg(false);
        });
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/user/login`, {
        username,
        password,
        institute_id: orgId || localStorage.getItem('institute_id') || null,
      });

      const data = res.data;

      if (data.message !== 'success') {
        toast.error(data.message || 'Invalid credentials');
        return;
      }

      localStorage.setItem('type', data.user_type || 'admin');
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('name', data.user_name);
      localStorage.setItem('last_password_change', data.last_password_change || '');
      localStorage.setItem('institute_id', data.institute_id);
      localStorage.setItem('institute_title', data.institute_title);
      localStorage.setItem('theme_color', data.theme_color || '#10B981');
      document.documentElement.style.setProperty('--theme-color', data.theme_color || '#10B981');

      toast.success(`Welcome, ${data.user_name}`);
      setTimeout(() => {
       navigate(`/${data.login_username}`);
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-theme mb-6">User Login</h2>

        {loadingOrg ? (
          <p className="text-center text-gray-500">Loading institute...</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
              <input
                ref={nameInputRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
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
              className="w-full bg-theme text-white py-2 rounded-md transition hover:opacity-90"
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