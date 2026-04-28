import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, Image as ImageIcon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Reels',
    mediaUrl: '',
    description: '',
    mediaType: 'image'
  });

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/portfolio`);
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('adminUser'))?.token;
    try {
      if (editingItem) {
        await axios.put(`${API_BASE_URL}/api/portfolio/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/portfolio`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', category: 'Reels', mediaUrl: '', description: '', mediaType: 'image' });
      fetchItems();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Delete this portfolio item?')) {
      const token = JSON.parse(localStorage.getItem('adminUser'))?.token;
      try {
        await axios.delete(`${API_BASE_URL}/api/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchItems();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="p-10">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Portfolio Manager</h1>
          <p className="text-gray-400">Add or edit your work showcase.</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setEditingItem(null); }}
          className="flex items-center gap-2 bg-accent px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
        >
          <Plus size={20} /> ADD PROJECT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item._id} className="glass rounded-3xl overflow-hidden group border border-white/5">
            <div className="aspect-video relative overflow-hidden">
              <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }}
                  className="p-3 bg-white text-black rounded-full hover:bg-accent hover:text-white transition-all"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">{item.category}</span>
              <h3 className="text-xl font-bold mt-1 text-white">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0d1117] border border-white/10 p-10 rounded-3xl w-full max-w-xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X size={28} />
              </button>
              <h2 className="text-2xl font-bold mb-8">{editingItem ? 'Edit Project' : 'Add New Project'}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent"
                    >
                      <option className="bg-black">Reels</option>
                      <option className="bg-black">Ads</option>
                      <option className="bg-black">Photography</option>
                      <option className="bg-black">Branding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Media Type</label>
                    <select
                      value={formData.mediaType}
                      onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent"
                    >
                      <option className="bg-black">image</option>
                      <option className="bg-black">video</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Media URL</label>
                  <input
                    type="text"
                    required
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent"
                    placeholder="Direct link or Cloudinary URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent"
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-accent hover:text-white transition-all">
                  {editingItem ? 'UPDATE PROJECT' : 'SAVE PROJECT'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioManager;
