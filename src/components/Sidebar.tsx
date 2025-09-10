import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Database, BarChart3, Activity, Cpu, Terminal } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/database',
      icon: Database,
      label: 'Dataset Browser',
      description: 'Browse and select eDNA datasets'
    },
    {
      path: '/pipeline',
      icon: Activity,
      label: 'Analysis Pipeline',
      description: 'Real-time processing monitor',
      disabled: !location.pathname.includes('/pipeline/')
    },
    {
      path: '/results',
      icon: BarChart3,
      label: 'Results Dashboard',
      description: 'Biodiversity analysis results',
      disabled: !location.pathname.includes('/results/')
    }
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-50"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">eDNA Analyzer</h1>
            <p className="text-xs text-slate-400">Biodiversity Discovery Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.disabled ? '#' : item.path}
              className={({ isActive }) =>
                `group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive || location.pathname.startsWith(item.path)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-80 truncate">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">System Status</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">GPU Cluster</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DNABERT-S</span>
              <span className="text-green-400">Ready</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Database</span>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
