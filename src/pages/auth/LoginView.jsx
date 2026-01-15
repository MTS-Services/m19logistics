import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { demoUsers } from '../../data/demoUsers';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Truck, Shield, User, Users } from 'lucide-react';

const LoginView = () => {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('topps022@toppstiles.co.uk');
  const [password, setPassword] = useState('Password022');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo credentials for each role
  const demoCredentials = {
    customer: { email: 'topps022@toppstiles.co.uk', password: 'Password022' },
    driver: { email: 'wwwbk@yahoo.co.uk', password: 'M1901' },
    area_manager: { email: 'rob.myers@toppstiles.com', password: 'Topps01' },
    admin: { email: 'admin@m19logistics.com', password: 'admin123' },
  };

  const roles = [
    {
      id: 'customer',
      label: 'Customer',
      icon: User,
      color: 'teal',
      bgColor: 'bg-teal-600',
      hoverColor: 'hover:bg-teal-700',
      borderColor: 'border-teal-600',
      textColor: 'text-teal-600',
    },
    {
      id: 'driver',
      label: 'Driver',
      icon: Truck,
      color: 'orange',
      bgColor: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      borderColor: 'border-orange-600',
      textColor: 'text-orange-600',
    },
    {
      id: 'area_manager',
      label: 'Manager',
      icon: Users,
      color: 'orange',
      bgColor: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      borderColor: 'border-orange-600',
      textColor: 'text-orange-600',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Shield,
      color: 'gray',
      bgColor: 'bg-gray-900',
      hoverColor: 'hover:bg-gray-800',
      borderColor: 'border-gray-900',
      textColor: 'text-gray-900',
    },
  ];

  const getRoleInfo = () => {
    switch (selectedRole) {
      case 'customer':
        return {
          title: 'Customer Login',
          label: 'Email Address',
          placeholder: 'Enter your email',
          buttonText: 'Login as Customer',
          buttonColor: 'bg-teal-600 hover:bg-teal-700',
          message: null,
        };
      case 'driver':
        return {
          title: 'Driver Login',
          label: 'Email Address',
          placeholder: 'Enter your email',
          buttonText: 'Login as Driver',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          message: 'Driver portal access requires an active driver ID',
        };
      case 'area_manager':
        return {
          title: 'Area Manager Login',
          label: 'Email Address',
          placeholder: 'Enter your email',
          buttonText: 'Login as Manager',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          message: 'Area Manager portal for regional oversight',
        };
      case 'admin':
        return {
          title: 'Admin Login',
          label: 'Email Address',
          placeholder: 'Enter your email',
          buttonText: 'Login as Admin',
          buttonColor: 'bg-gray-900 hover:bg-gray-800',
          message: 'Secure area. All actions are logged',
        };
      default:
        return {
          title: 'Login',
          label: 'Email Address',
          placeholder: 'Enter your email',
          buttonText: 'Sign In',
          buttonColor: 'bg-teal-600 hover:bg-teal-700',
          message: null,
        };
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Find user by email/username AND matching role
      const user = demoUsers.find(
        (u) =>
          (u.email === email || u.username === email) &&
          u.password === password &&
          u.role === selectedRole
      );

      if (user) {
        login(user);
        toast.success(`Welcome back, ${user.name}!`);

        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'driver':
            navigate('/driver/dashboard');
            break;
          case 'customer':
            navigate('/customer');
            break;
          case 'area_manager':
            navigate('/area-manager/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error('Invalid credentials or incorrect role selected');
      }
      setLoading(false);
    }, 500);
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-teal-500">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">M19 Logistics</h1>
          <p className="mt-2 text-gray-600">Select your role and sign in to your account</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="mb-6 rounded-lg bg-gray-100 p-2">
          <div className="grid grid-cols-4 gap-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.id);
                    // Auto-fill demo credentials when role is selected
                    setEmail(demoCredentials[role.id].email);
                    setPassword(demoCredentials[role.id].password);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? `${role.bgColor} text-white shadow-md`
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">{roleInfo.title}</h2>

          {/* Role-specific message */}
          {roleInfo.message && (
            <div
              className={`mb-6 rounded-lg ${
                selectedRole === 'driver'
                  ? 'border border-orange-200 bg-orange-50'
                  : selectedRole === 'area_manager'
                    ? 'border border-orange-200 bg-orange-50'
                    : selectedRole === 'admin'
                      ? 'border border-gray-300 bg-gray-100'
                      : 'border border-teal-200 bg-teal-50'
              } p-4`}
            >
              <p
                className={`text-sm ${
                  selectedRole === 'driver'
                    ? 'text-orange-800'
                    : selectedRole === 'area_manager'
                      ? 'text-orange-800'
                      : selectedRole === 'admin'
                        ? 'text-gray-800'
                        : 'text-teal-800'
                }`}
              >
                {roleInfo.message}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {roleInfo.label}
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                placeholder={roleInfo.placeholder}
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
              className={`flex w-full items-center justify-center rounded-md px-4 py-3 text-white shadow-md transition-all ${roleInfo.buttonColor} focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50`}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <span className="font-medium">{roleInfo.buttonText}</span>
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
