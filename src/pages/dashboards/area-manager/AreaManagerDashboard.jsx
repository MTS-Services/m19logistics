import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { BarChart3, TrendingUp, Package, DollarSign, LogOut, Eye } from 'lucide-react';

const DashboardHome = () => (
  <div>
    <h1 className="mb-6 text-3xl font-bold">Analytics Dashboard</h1>
    <div className="mb-6 grid gap-6 md:grid-cols-4">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Deliveries</p>
            <p className="text-2xl font-bold">1,243</p>
          </div>
          <Package className="h-10 w-10 text-teal-600" />
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">£45,230</p>
          </div>
          <DollarSign className="h-10 w-10 text-green-600" />
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold">234</p>
          </div>
          <TrendingUp className="h-10 w-10 text-blue-600" />
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Avg per Delivery</p>
            <p className="text-2xl font-bold">£48.50</p>
          </div>
          <BarChart3 className="h-10 w-10 text-purple-600" />
        </div>
      </div>
    </div>

    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-xl font-semibold">Store Performance - Topps Tiles</h3>
      <div className="space-y-4">
        <p className="text-gray-600">Analytics data visualization coming soon...</p>
      </div>
    </div>
  </div>
);

const AreaManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Area Manager Dashboard</h1>
            <p className="text-sm text-gray-600">Read-Only Access - {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <div className="flex items-start space-x-3">
            <Eye className="mt-1 h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">View-Only Access</h3>
              <p className="text-sm text-blue-700">
                You have read-only access to all Topps Tiles store analytics and delivery data.
              </p>
            </div>
          </div>
        </div>

        <Routes>
          <Route index element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default AreaManagerDashboard;
