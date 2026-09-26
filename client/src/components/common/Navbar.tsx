import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Profile';

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-neutral-900 font-bold text-xl hover:opacity-80 transition">
          <Compass className="w-6 h-6 text-neutral-900" />
          <span>SkillCompass</span>
        </Link>

        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition">Dashboard</Link>
              <Link to="/onboarding" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition">Onboarding</Link>
              <Link to="/skills" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition">Skills</Link>
              <Link to="/careers" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition">Careers</Link>
              <Link to="/roadmap" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition">Roadmap</Link>
              <Link to="/coach" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition">AI Coach</Link>

              <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                <Link to="/profile" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-neutral-700 transition">
                  <UserIcon className="w-4 h-4 text-neutral-700" />
                  <span>{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-red-600 p-1 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition">Login</Link>
              <Link
                to="/register"
                className="text-xs bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl font-semibold transition"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
