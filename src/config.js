let BASE_URL = '';

if (window?.location?.hostname === 'localhost') {
  // Local development
  BASE_URL = 'http://localhost:5000';
} else {
  // Production or fallback
  BASE_URL = 'https://socialbackend-iucy.onrender.com';
}

export default BASE_URL;
