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
  const [rememberMe, setRememberMe] = useState(true);
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const getInstituteId = () => {
    const fromQuery = searchParams.get('i');
    if (fromQuery) return fromQuery;

    const host = window.location.hostname;
    const parts = host.split('.');
    const subdomain = parts.length > 2 ? parts[0] : null;
    if (subdomain && subdomain !== 'www' && subdomain !== 'instify') return subdomain;

    return null;
  };

  const fetchBranding = async () => {
    const insti = getInstituteId();

    try {
      const res = await axios.get(`${BASE_URL}/api/branding?i=${insti || 'default'}`);
      const data = res.data;
      const themeColor = data.theme?.color || '#10B981';

      setBranding(data);
      localStorage.setItem('institute_title', data.institute || '');
      localStorage.setItem('theme_color', themeColor);
      localStorage.setItem('favicon', data.favicon || '');
      localStorage.setItem('logo', data.logo || '');

      document.documentElement.style.setProperty('--theme-color', themeColor);

      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = data.favicon || '/favicon.ico';
      document.title = `${data.institute || 'Instify'} | Instify`;
    } catch (err) {
      console.error('Branding fetch error:', err);
      toast.error('⚠️ Failed to load branding');
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

      const userObj = {
        id: data.user_id,
        name: data.user_name,
        role: data.user_role || 'admin',
        username: data.login_username,
      };

      const instituteObj = {
        institute_id: data.institute_id,
        institute_uuid: data.institute_uuid,
        institute_title: data.institute_name,
        theme_color: data.theme_color || '#10B981',
      };

      // Store login method
      localStorage.setItem('remember_me', rememberMe ? 'true' : 'false');
      const storage = rememberMe ? localStorage : sessionStorage;

      // Store full objects
      storage.setItem('user', JSON.stringify(userObj));
      storage.setItem('institute', JSON.stringify(instituteObj));

  // Legacy individual keys for pages that still rely on them
      const allStores = [localStorage, sessionStorage];
      allStores.forEach((s) => {
        s.setItem('user_id', String(data.user_id));
        s.setItem('user_name', data.user_name);
        s.setItem('user_role', data.user_role || 'admin');
        s.setItem('login_username', data.login_username);
        s.setItem('institute_id', String(data.institute_id));
        s.setItem('institute_uuid', data.institute_uuid);
        s.setItem('institute_title', data.institute_name);
        s.setItem('theme_color', data.theme_color || '#10B981');
      });


      // Update AppContext
      if (window.updateAppContext) {
        window.updateAppContext({ user: userObj, institute: instituteObj });
      }

      toast.success(`Welcome, ${data.user_name}`);
      setTimeout(() => navigate(`/${data.login_username}`), 800);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Toaster position="top-center" />
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        <div className="flex justify-center mb-6">
          <img src={branding?.logo || '/logo.png'} alt="Logo" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: branding?.theme?.color || '#10B981' }}>
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
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                id="rememberMe"
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">Keep me logged in</label>
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
