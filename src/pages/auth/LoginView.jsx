import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Truck } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import { ENDPOINT } from '../../services/httpEndpoint';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(ENDPOINT.API.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token, requirePasswordReset } = response.data.data;

        // Store user and token
        login(user, token);

        toast.success(response.data.message || `Welcome back, ${user.fullName || user.username}!`);

        // Redirect based on role from backend
        const role = user.role.toLowerCase();
        switch (role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'driver':
            navigate('/driver/dashboard');
            break;
          case 'customer':
            navigate('/customer');
            break;
          case 'manager':
            navigate('/manager/dashboard');
            break;
          case 'area_manager':
            navigate('/area-manager/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-teal-500">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">M19 Logistics</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Login</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md bg-teal-600 hover:bg-teal-700 px-4 py-3 text-white shadow-md transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <span className="font-medium">Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium text-teal-600 hover:text-teal-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;