import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleLoginButton from '../components/ui/auth/GoogleAuthButton';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setBackendError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setBackendError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">Register</h2>

        {backendError && <p className="text-red-500 text-sm text-center">{backendError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Name</label>
            <input
              name="name"
              type="text"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-gray-500 text-sm">or</div>

        <GoogleLoginButton onSuccessRedirect={() => navigate('/')} />

        <p className="text-sm text-center">
          Already have an account? <a href="/login" className="text-accent hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
