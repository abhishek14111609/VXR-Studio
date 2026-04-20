import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, Zap } from 'lucide-react';

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
            const { data } = await axios.get('http://localhost:5000/api/services');
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
        try {
            if (editingService) {
                await axios.put(`http://localhost:5000/api/services/${editingService._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/services', formData, {
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
                await axios.delete(`http://localhost:5000/api/services/${id}`, {
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
                                    setFormData(service);
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
                            className="bg-[#0d1117] border border-white/10 p-10 rounded-3xl w-full max-w-2xl relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                                <X size={28} />
                            </button>
                            <h2 className="text-2xl font-bold mb-8">{editingService ? 'Edit Service' : 'Add New Service'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Service Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-4 uppercase">Pricing Tiers</label>
                                    <div className="space-y-6 max-h-96 overflow-y-auto">
                                        {formData.plans.map((plan, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 relative">
                                                <button
                                                    type="button"
                                                    onClick={() => removePlan(idx)}
                                                    className="absolute top-2 right-2 text-red-400 hover:bg-red-400/10 p-1 rounded"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 mb-1">Tier Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Starter"
                                                            value={plan.tier}
                                                            onChange={(e) => {
                                                                const newPlans = [...formData.plans];
                                                                newPlans[idx].tier = e.target.value;
                                                                setFormData({ ...formData, plans: newPlans });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 mb-1">Price (₹)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., 5,999"
                                                            value={plan.price}
                                                            onChange={(e) => {
                                                                const newPlans = [...formData.plans];
                                                                newPlans[idx].price = e.target.value;
                                                                setFormData({ ...formData, plans: newPlans });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() => addFeature(idx)}
                                                        className="text-xs text-accent font-bold mb-2"
                                                    >
                                                        + Add Feature
                                                    </button>
                                                    <div className="space-y-2">
                                                        {plan.features.map((feature, fIdx) => (
                                                            <input
                                                                key={fIdx}
                                                                type="text"
                                                                placeholder="Feature description"
                                                                value={feature}
                                                                onChange={(e) => {
                                                                    const newPlans = [...formData.plans];
                                                                    newPlans[idx].features[fIdx] = e.target.value;
                                                                    setFormData({ ...formData, plans: newPlans });
                                                                }}
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addPlan}
                                        className="mt-4 px-4 py-2 bg-accent/20 border border-accent rounded-lg text-accent font-bold text-sm hover:bg-accent/30 transition-all"
                                    >
                                        + Add Tier
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all"
                                >
                                    {editingService ? 'Update Service' : 'Create Service'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServicesManager;
