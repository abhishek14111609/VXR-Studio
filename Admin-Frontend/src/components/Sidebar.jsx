import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileImage, MessageSquare, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Portfolio', icon: <FileImage size={20} />, path: '/portfolio' },
    { title: 'Services', icon: <Settings size={20} />, path: '/services' },
    { title: 'Pricing', icon: <Settings size={20} />, path: '/pricing' },
    { title: 'About', icon: <Settings size={20} />, path: '/about' },
    { title: 'Leads', icon: <MessageSquare size={20} />, path: '/leads' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#0d1117] border-r border-white/5 p-6 flex flex-col">
      <div className="text-2xl font-bold mb-12">
        VXR<span className="text-accent">ADMIN</span>
      </div>

      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-auto"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
