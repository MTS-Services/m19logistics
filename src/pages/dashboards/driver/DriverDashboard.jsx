import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Package, CheckCircle, Camera, LogOut, Truck, User } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center space-x-4">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <User className="h-10 w-10 text-blue-600" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-600">Driver</p>
          </div>
        </div>
      </div>

      <h1 className="mb-6 text-3xl font-bold">My Deliveries</h1>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assigned</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <Package className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total This Week</p>
              <p className="text-2xl font-bold">43</p>
            </div>
            <Truck className="h-10 w-10 text-teal-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold">Assigned Deliveries</h3>
        <p className="text-gray-600">No deliveries assigned yet.</p>
      </div>
    </div>
  );
};

const DriverDashboard = () => {
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
          <div className="flex items-center space-x-4">
            <Truck className="h-8 w-8 text-teal-600" />
            <div>
              <h1 className="text-2xl font-semibold">M19 Driver Portal</h1>
              <p className="text-sm text-gray-600">{user?.name}</p>
            </div>
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
        <Routes>
          <Route index element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default DriverDashboard;
