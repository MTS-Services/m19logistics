import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const UnauthorizedView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-teal-600 px-6 py-2 text-white hover:bg-teal-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedView;
