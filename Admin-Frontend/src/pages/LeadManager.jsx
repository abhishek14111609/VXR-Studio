import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Mail, Phone, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const LeadManager = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminUser'))?.token}` }
      });
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminUser'))?.token}` }
        });
        fetchLeads();
      } catch (err) {
        alert('Failed to delete lead');
      }
    }
  };

  return (
    <div className="p-10">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Lead Management</h1>
          <p className="text-gray-400">Manage your business inquiries and client requests.</p>
        </div>
        <div className="text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          Total Leads: {leads.length}
        </div>
      </div>

      <div className="space-y-4">
        {leads.length === 0 && !loading && (
          <div className="p-20 text-center glass rounded-3xl text-gray-500">
            No leads found yet. Keep sharing your work!
          </div>
        )}

        {leads.map((lead, i) => (
          <motion.div
            key={lead._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 bg-white/5 border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between gap-8 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-bold">{lead.name}</h3>
                <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase tracking-widest">{lead.projectType}</span>
                <span className="px-3 py-1 bg-white/10 text-gray-400 text-xs font-bold rounded-full">{lead.budget}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2"><Mail size={16} /> {lead.email}</div>
                <div className="flex items-center gap-2"><Phone size={16} /> {lead.phone}</div>
                <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(lead.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="p-6 bg-black/30 rounded-2xl text-gray-300 italic">
                "{lead.message}"
              </div>
            </div>

            <div className="flex md:flex-col justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href={`mailto:${lead.email}`} className="p-4 bg-accent/10 text-accent rounded-2xl hover:bg-accent hover:text-white transition-all">
                <ExternalLink size={20} />
              </a>
              <button
                onClick={() => deleteLead(lead._id)}
                className="p-4 bg-red-400/10 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeadManager;
