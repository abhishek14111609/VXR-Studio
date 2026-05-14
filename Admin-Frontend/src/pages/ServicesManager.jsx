import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, Zap } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'Zap',
        plans: [{ tier: 'Starter', price: '', features: [''] }]
    });

    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/services`);
            setServices(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('adminUser'))?.token;

        // Convert form format to API format
        const payload = {
            serviceTitle: formData.name,
            description: formData.description,
            icon: formData.icon || 'Zap',
            tiers: (formData.plans || []).map(plan => ({
                name: plan.tier,
                price: plan.price,
                features: (plan.features || []).map(f => ({ text: f })),
                highlight: plan.highlight || false,
                period: plan.period || '/month'
            })),
            highlights: []
        };

        try {
            if (editingService) {
                await axios.put(`${API_BASE_URL}/api/services/${editingService._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/services`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            setEditingService(null);
            setFormData({ name: '', description: '', icon: 'Zap', plans: [{ tier: 'Starter', price: '', features: [''] }] });
            fetchServices();
        } catch (err) {
            alert('Operation failed: ' + err.message);
        }
    };

    const deleteService = async (id) => {
        if (window.confirm('Delete this service?')) {
            const token = JSON.parse(localStorage.getItem('adminUser'))?.token;
            try {
                await axios.delete(`${API_BASE_URL}/api/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchServices();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const addPlan = () => {
        setFormData({
            ...formData,
            plans: [...formData.plans, { tier: '', price: '', features: [''] }]
        });
    };

    const removePlan = (index) => {
        setFormData({
            ...formData,
            plans: formData.plans.filter((_, i) => i !== index)
        });
    };

    const removeFeature = (planIndex, featureIndex) => {
        const newPlans = [...formData.plans];
        newPlans[planIndex].features = newPlans[planIndex].features.filter((_, i) => i !== featureIndex);
        setFormData({ ...formData, plans: newPlans });
    };

    const addFeature = (planIndex) => {
        const newPlans = [...formData.plans];
        newPlans[planIndex].features.push('');
        setFormData({ ...formData, plans: newPlans });
    };

    return (
        <div className="p-10">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Services Manager</h1>
                    <p className="text-gray-400">Manage your service offerings and pricing tiers.</p>
                </div>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditingService(null);
                        setFormData({ name: '', description: '', icon: 'Zap', plans: [{ tier: 'Starter', price: '', features: [''] }] });
                    }}
                    className="flex items-center gap-2 bg-accent px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
                >
                    <Plus size={20} /> ADD SERVICE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <div key={service._id} className="glass rounded-3xl overflow-hidden p-6 border border-white/5 relative group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap size={24} className="text-accent" />
                                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                        <div className="mb-4 space-y-2">
                            {service.plans?.map((plan, idx) => (
                                <div key={idx} className="text-xs text-gray-300">
                                    <span className="text-accent font-bold">{plan.tier}:</span> ₹{plan.price}
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setEditingService(service);
                                    // Convert API format to form format
                                    setFormData({
                                        name: service.serviceTitle,
                                        description: service.description,
                                        icon: service.icon || 'Zap',
                                        plans: (service.tiers || []).map(tier => ({
                                            tier: tier.name,
                                            price: tier.price,
                                            features: (tier.features || []).map(f => f.text),
                                            highlight: tier.highlight || false,
                                            period: tier.period || '/month'
                                        }))
                                    });
                                    setIsModalOpen(true);
                                }}
                                className="p-2 bg-white text-black rounded-full hover:bg-accent transition-all"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={() => deleteService(service._id)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto py-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0d1117] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4"
                        >
                            {/* Header and close button handled by sticky header below */}

                            {/* Sticky Header */}
                            <div className="sticky top-0 bg-gradient-to-b from-[#0d1117] to-[#0d1117]/90 border-b border-white/10 px-8 py-6 z-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                                    <p className="text-gray-400 text-sm mt-1">Manage pricing tiers and features</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                                    <X size={28} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 pb-28">
                                <div className="space-y-8 max-w-3xl mx-auto">
                                    {/* Service Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Service Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all"
                                            placeholder="e.g., Social Media Management"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Description *</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all resize-none"
                                            rows="3"
                                            placeholder="Describe your service offering..."
                                        />
                                    </div>

                                    {/* Pricing Tiers Section */}
                                    <div className="border-t border-white/20 pt-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                    <Zap size={22} className="text-accent" />
                                                    Pricing Tiers
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">Create and manage service pricing options</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addPlan}
                                                className="px-4 py-2 bg-gradient-to-r from-accent/30 to-blue-500/20 border-2 border-accent/50 rounded-lg text-accent font-bold text-sm hover:from-accent/40 hover:to-blue-500/30 hover:border-accent transition-all flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Add Tier
                                            </button>
                                        </div>

                                        {/* Tiers List */}
                                        <div className="space-y-5">
                                            {formData.plans && formData.plans.length > 0 ? (
                                                formData.plans.map((plan, idx) => (
                                                    <div key={idx} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 relative group hover:border-accent/50 transition-all">
                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => removePlan(idx)}
                                                            className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X size={18} />
                                                        </button>

                                                        {/* Tier Header - Name & Price */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 pr-8">
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Tier Name</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g., Starter"
                                                                    value={plan.tier}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...formData.plans];
                                                                        newPlans[idx].tier = e.target.value;
                                                                        setFormData({ ...formData, plans: newPlans });
                                                                    }}
                                                                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-accent focus:bg-black/50 text-white font-medium transition-all"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Price (₹/month)</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g., 5,999"
                                                                    value={plan.price}
                                                                    onChange={(e) => {
                                                                        const newPlans = [...formData.plans];
                                                                        newPlans[idx].price = e.target.value;
                                                                        setFormData({ ...formData, plans: newPlans });
                                                                    }}
                                                                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-accent focus:bg-black/50 text-white font-medium transition-all"
                                                                />
                                                            </div>
                                                            <div className="flex items-end">
                                                                <label className="flex items-center gap-3 cursor-pointer w-full bg-accent/10 rounded-lg px-4 py-3 border border-accent/30 hover:border-accent/60 transition-all">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={plan.highlight || false}
                                                                        onChange={(e) => {
                                                                            const newPlans = [...formData.plans];
                                                                            newPlans[idx].highlight = e.target.checked;
                                                                            setFormData({ ...formData, plans: newPlans });
                                                                        }}
                                                                        className="w-5 h-5 accent-accent cursor-pointer rounded"
                                                                    />
                                                                    <span className="text-xs font-bold text-gray-200 uppercase tracking-wide">Featured</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Features Section */}
                                                        <div className="border-t border-white/10 pt-4">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Features</label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addFeature(idx)}
                                                                    className="text-xs text-accent font-bold hover:text-blue-300 transition-colors"
                                                                >
                                                                    + Add Feature
                                                                </button>
                                                            </div>
                                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                                {plan.features && plan.features.length > 0 ? (
                                                                    plan.features.map((feature, fIdx) => (
                                                                        <div key={fIdx} className="flex items-center gap-2 group">
                                                                            <span className="text-accent text-lg leading-none">✓</span>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Feature description"
                                                                                value={feature}
                                                                                onChange={(e) => {
                                                                                    const newPlans = [...formData.plans];
                                                                                    newPlans[idx].features[fIdx] = e.target.value;
                                                                                    setFormData({ ...formData, plans: newPlans });
                                                                                }}
                                                                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent focus:bg-black/40 text-white placeholder-gray-500 text-sm transition-all"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeFeature(idx, fIdx)}
                                                                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                                            >
                                                                                <X size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-xs text-gray-500 italic py-2">No features added yet</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                                                    <Zap size={32} className="text-gray-600 mx-auto mb-3" />
                                                    <p className="text-gray-400 text-sm">No pricing tiers yet. Click "Add Tier" to create one!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Sticky Footer */}
                            <div className="sticky bottom-0 bg-gradient-to-t from-[#0d1117] to-transparent border-t border-white/10 px-8 py-6 flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    type="button"
                                    className="px-8 py-3 bg-gradient-to-r from-accent to-blue-600 rounded-xl text-white font-bold hover:from-blue-500 hover:to-blue-700 transition-all shadow-lg shadow-accent/30 flex items-center gap-2"
                                >
                                    {editingService ? 'Update Service' : 'Create Service'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServicesManager;
