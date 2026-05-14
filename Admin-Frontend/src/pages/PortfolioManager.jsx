import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, Image as ImageIcon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Reels',
    mediaUrl: '',
    description: '',
    mediaType: 'image'
  });

  const resetForm = () => {
    setFormData({ title: '', category: 'Reels', mediaUrl: '', description: '', mediaType: 'image' });
    setEditingItem(null);
    setMediaFile(null);
    setMediaPreview('');
  };

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

  useEffect(() => {
    if (!mediaFile) return undefined;

    const objectUrl = URL.createObjectURL(mediaFile);
    setMediaPreview(objectUrl);
    setFormData((prev) => ({
      ...prev,
      mediaType: mediaFile.type.startsWith('video/') ? 'video' : 'image'
    }));

    return () => URL.revokeObjectURL(objectUrl);
  }, [mediaFile]);

  const openNewModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Reels',
      mediaUrl: item.mediaUrl || '',
      description: item.description || '',
      mediaType: item.mediaType || 'image'
    });
    setMediaFile(null);
    setMediaPreview(item.mediaUrl || '');
    setIsModalOpen(true);
  };

  const handleMediaChange = (file) => {
    if (!file) return;
    setMediaFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('adminUser'))?.token;

    if (!formData.mediaUrl && !mediaFile) {
      alert('Please upload a photo or video for the portfolio item.');
      return;
    }

    try {
      setSubmitting(true);

      let mediaUrl = formData.mediaUrl;
      let mediaType = formData.mediaType;

      if (mediaFile) {
        const uploadData = new FormData();
        uploadData.append('media', mediaFile);

        const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload/portfolio-media`, uploadData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        mediaUrl = uploadResponse.data.mediaUrl;
        mediaType = uploadResponse.data.mediaType || mediaType;
      }

      const payload = {
        ...formData,
        mediaUrl,
        mediaType,
      };

      if (editingItem) {
        await axios.put(`${API_BASE_URL}/api/portfolio/${editingItem._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/portfolio`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
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
          onClick={openNewModal}
          className="flex items-center gap-2 bg-accent px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
        >
          <Plus size={20} /> ADD PROJECT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item._id} className="glass rounded-3xl overflow-hidden group border border-white/5">
            <div className="aspect-video relative overflow-hidden">
              {item.mediaType === 'video' ? (
                <video
                  src={item.mediaUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => openEditModal(item)}
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
              className="bg-[#0d1117] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4"
            >
              <div className="sticky top-0 bg-linear-to-b from-[#0d1117] to-[#0d1117]/90 border-b border-white/10 px-8 py-6 z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">{editingItem ? 'Edit Project' : 'Add New Project'}</h2>
                  <p className="text-gray-400 text-sm mt-1">Upload a photo or video directly</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                  <X size={28} />
                </button>
              </div>

              <form id="portfolio-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 pb-28">
                <div className="space-y-8 max-w-3xl mx-auto">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all"
                      >
                        <option className="bg-black">Reels</option>
                        <option className="bg-black">Ads</option>
                        <option className="bg-black">Photography</option>
                        <option className="bg-black">Branding</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Media Type</label>
                      <select
                        value={formData.mediaType}
                        onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all"
                      >
                        <option className="bg-black">image</option>
                        <option className="bg-black">video</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Upload Media *</label>
                    <label className="flex flex-col items-center justify-center gap-3 w-full min-h-55 border-2 border-dashed border-white/15 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-accent/60 transition-all cursor-pointer px-6 text-center">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => handleMediaChange(e.target.files?.[0])}
                      />
                      <ImageIcon size={36} className="text-accent" />
                      <div>
                        <p className="text-white font-semibold">Click to upload an image or video</p>
                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, WebP, MP4, MOV up to 50MB</p>
                      </div>
                    </label>

                    {mediaPreview ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                        {formData.mediaType === 'video' || mediaPreview.match(/\.(mp4|mov|webm|m4v)(\?|$)/i) ? (
                          <video src={mediaPreview} controls className="w-full max-h-80 object-cover" />
                        ) : (
                          <img src={mediaPreview} alt="Portfolio preview" className="w-full max-h-80 object-cover" />
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Description</label>
                    <textarea
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all resize-none"
                    />
                  </div>
                </div>
              </form>

              <div className="sticky bottom-0 bg-linear-to-t from-[#0d1117] to-transparent border-t border-white/10 px-8 py-6 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="portfolio-form"
                  disabled={submitting}
                  className="px-8 py-3 bg-linear-to-r from-accent to-blue-600 rounded-xl text-white font-bold hover:from-blue-500 hover:to-blue-700 transition-all shadow-lg shadow-accent/30 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioManager;
