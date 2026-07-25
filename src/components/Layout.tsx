import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { HiAcademicCap, HiChartBar, HiBookOpen, HiStar, HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: HiChartBar },
  { to: '/students', label: 'Students', icon: HiAcademicCap },
  { to: '/subjects', label: 'Subjects', icon: HiBookOpen },
  { to: '/scores', label: 'Scores', icon: HiStar },
];

const Layout = () => {
  const location = useLocation();
  const { dark, toggle } = useTheme();
  const [sidebarReady, setSidebarReady] = useState(false);

  // Trigger sidebar slide-in after first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setSidebarReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const activeLabel = navItems.find(
    (n) => n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to)
  )?.label ?? 'Scholaris';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        style={{
          transform: sidebarReady ? 'translateX(0)' : 'translateX(-240px)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="w-60 flex-shrink-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg shadow">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Scholaris</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">School Management</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {dark ? <HiSun className="h-5 w-5 flex-shrink-0" /> : <HiMoon className="h-5 w-5 flex-shrink-0" />}
            <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm px-6 py-3">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-100">{activeLabel}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            localhost:8080
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
