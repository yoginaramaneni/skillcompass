import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Compass,
  LayoutDashboard,
  User,
  Award,
  CheckSquare,
  Map,
  TrendingUp,
  ArrowRightLeft,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-neutral-600">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-neutral-900 animate-spin" />
          <span className="text-xs font-semibold text-neutral-900">Loading SkillCompass...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems: Array<{ label: string; path: string; icon: any; exact?: boolean; badge?: string }> = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { label: 'My Profile', path: '/onboarding', icon: User },
    { label: 'Skills & Graph', path: '/skills', icon: Award },
    { label: 'Assessments', path: '/assessments', icon: CheckSquare },
    { label: 'Learning Roadmap', path: '/roadmap', icon: Map },
    { label: 'Market Trends', path: '/market-trends', icon: TrendingUp },
    { label: 'Compare Careers', path: '/compare-careers', icon: ArrowRightLeft },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col md:flex-row">
      {/* Mobile Top Navbar Header */}
      <div className="md:hidden bg-white border-b border-neutral-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-neutral-900" />
          <span className="font-bold text-lg text-neutral-900 tracking-tight">SkillCompass</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg border border-neutral-200 focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col justify-between z-40 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-900">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-neutral-900 tracking-tight leading-none">SkillCompass</h2>
              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Career Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4">
            <p className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider px-3 mb-2 font-semibold">
              Navigation
            </p>
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3 h-3 opacity-30" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User & Logout */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-900 text-xs font-bold shrink-0">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-neutral-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-transparent hover:border-neutral-200 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}
    </div>
  );
};
