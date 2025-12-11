import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { path: '/investments', label: 'Investissements', icon: '📈' },
    { path: '/settings', label: 'Paramètres', icon: '⚙️' },
    { path: '/simulations', label: 'Simulations', icon: '🧮' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const initials = `${user?.firstName?.[0] ?? 'N'}${user?.lastName?.[0] ?? 'B'}`;

  return (
    <div className="min-h-screen bg-beige-50">
      <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-beige-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 lg:h-20 px-4 lg:px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-display text-lg shadow-md">
              N
            </div>
            <span className="font-display text-xl font-semibold text-black hidden sm:inline">NovaBank</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl font-body text-sm transition-all ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-700 hover:bg-beige-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-body font-medium text-black">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="font-body text-xs text-gray-600">{user?.email}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-body font-semibold">
              {initials}
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-beige-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Ouvrir le menu"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-display text-lg shadow-md">
                      N
                    </div>
                    <div>
                      <p className="font-display text-lg text-black">NovaBank</p>
                      <p className="text-xs font-body text-gray-600">Navigation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-beige-100"
                    aria-label="Fermer le menu"
                  >
                    ✕
                  </button>
                </div>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl font-body transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-black hover:bg-beige-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl font-body text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>🚪</span>
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 lg:px-6 pt-24 lg:pt-28 pb-10">
        {children}
      </main>
    </div>
  );
};

