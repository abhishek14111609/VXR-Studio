import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, FileImage, Layers, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    leads: 0,
    portfolio: 0,
    services: 4,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const leadRes = await axios.get('http://localhost:5000/api/leads', {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminUser'))?.token}` }
        });
        const portRes = await axios.get('http://localhost:5000/api/portfolio');
        setStats({
          leads: leadRes.data.length,
          portfolio: portRes.data.length,
          services: 4, // Fixed for now
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Leads', value: stats.leads, icon: <Users className="text-blue-400" />, trend: '+12% from last week' },
    { title: 'Portfolio Items', value: stats.portfolio, icon: <FileImage className="text-purple-400" />, trend: '2 items added today' },
    { title: 'Active Services', value: stats.services, icon: <Layers className="text-orange-400" />, trend: 'Healthy status' },
    { title: 'Conversion Rate', value: '3.2%', icon: <TrendingUp className="text-green-400" />, trend: 'Improving steadily' },
  ];

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Welcome Back, Admin</h1>
        <p className="text-gray-400">Here's what's happening with VXR Studios today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white/5 border border-white/5 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl">{card.icon}</div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Stats</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            <div className="text-4xl font-bold mb-4">{card.value}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-green-400 font-bold">{card.trend.split(' ')[0]}</span> {card.trend.split(' ').slice(1).join(' ')}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-white/5 border border-white/5 rounded-3xl min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Recent Performance</h3>
          <div className="flex items-center justify-center h-full text-gray-500 italic">
            Performance chart visualization would go here.
          </div>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">System Status</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Database</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">CONNECTED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cloudinary API</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">JWT Token</span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full">SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
