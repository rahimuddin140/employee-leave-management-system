import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 text-sm'
      : 'text-gray-600 hover:text-blue-600 font-medium text-sm transition';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              Q
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">QuickEMS</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-200">
                PS4 Leave Portal
              </span>
            </div>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              {user.role === 'admin' ? (
                <>
                  <NavLink to="/admin/dashboard" className={navLinkStyle}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/requests" className={navLinkStyle}>
                    Leave Requests
                  </NavLink>
                  <NavLink to="/admin/leave-types" className={navLinkStyle}>
                    Leave Types
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/my-leaves" className={navLinkStyle}>
                    My Leaves
                  </NavLink>
                  <NavLink to="/apply-leave" className={navLinkStyle}>
                    Apply Leave
                  </NavLink>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {user.department} • {user.employeeId}
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {user.role}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-md shadow-sm transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div className="md:hidden flex items-center justify-around border-t border-gray-100 py-2 bg-gray-50 text-xs">
          {user.role === 'admin' ? (
            <>
              <NavLink to="/admin/dashboard" className={navLinkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/requests" className={navLinkStyle}>
                Requests
              </NavLink>
              <NavLink to="/admin/leave-types" className={navLinkStyle}>
                Leave Types
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/my-leaves" className={navLinkStyle}>
                My Leaves
              </NavLink>
              <NavLink to="/apply-leave" className={navLinkStyle}>
                Apply Leave
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
