import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, DollarSign } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const PricingManager = () => {
    const [pricingData, setPricingData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        serviceTitle: '',
        description: '',
        highlights: [''],
        tiers: [{ name: 'Starter', price: '', period: '/month', features: [''], highlight: false }]
    });

    useEffect(() => {
        fetchPricingData();
    }, []);

    const getAuthConfig = () => {
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
        const token = adminUser?.token;
        return {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        };
    };

    const toFormData = (service) => ({
        serviceTitle: service.serviceTitle || '',
        description: service.description || '',
        highlights: (service.highlights?.length ? service.highlights : ['']),
        tiers: (service.tiers || []).map((tier) => ({
            name: tier.name || '',
            price: (tier.price || '').toString().replace(/^₹\s?/, ''),
            period: tier.period || '/month',
            features: (tier.features || []).map((feature) =>
                typeof feature === 'string' ? feature : feature?.text || ''
            ),
            highlight: !!tier.highlight,
        })),
    });

    const toApiPayload = () => ({
        serviceTitle: formData.serviceTitle,
        description: formData.description,
        highlights: formData.highlights.map((item) => item.trim()).filter(Boolean),
        tiers: formData.tiers.map((tier) => ({
            name: tier.name,
            price: `₹${(tier.price || '').replace(/^₹\s?/, '').trim()}`,
            period: tier.period,
            features: tier.features
                .map((feature) => (feature || '').trim())
                .filter(Boolean)
                .map((text) => ({ text })),
            highlight: !!tier.highlight,
        })),
        icon: 'Zap',
    });

    const fetchPricingData = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/services`);
            setPricingData(data || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load pricing data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = toApiPayload();

            if (editingServiceId) {
                await axios.put(
                    `${API_BASE_URL}/api/services/${editingServiceId}`,
                    payload,
                    getAuthConfig()
                );
            } else {
                await axios.post(`${API_BASE_URL}/api/services`, payload, getAuthConfig());
            }

            await fetchPricingData();
            setIsModalOpen(false);
            setEditingServiceId(null);
            setFormData({
                serviceTitle: '',
                description: '',
                highlights: [''],
                tiers: [{ name: 'Starter', price: '', period: '/month', features: [''], highlight: false }],
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const deletePricing = async (serviceId) => {
        if (window.confirm('Delete this pricing plan?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/services/${serviceId}`, getAuthConfig());
                await fetchPricingData();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const addTier = () => {
        setFormData({
            ...formData,
            tiers: [...formData.tiers, { name: '', price: '', period: '/month', features: [''], highlight: false }]
        });
    };

    const removeTier = (index) => {
        setFormData({
            ...formData,
            tiers: formData.tiers.filter((_, i) => i !== index)
        });
    };

    const addFeature = (tierIndex) => {
        const newTiers = [...formData.tiers];
        newTiers[tierIndex].features.push('');
        setFormData({ ...formData, tiers: newTiers });
    };

    const removeFeature = (tierIndex, featureIndex) => {
        const newTiers = [...formData.tiers];
        newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
        setFormData({ ...formData, tiers: newTiers });
    };

    const addHighlight = () => {
        setFormData({
            ...formData,
            highlights: [...formData.highlights, ''],
        });
    };

    const removeHighlight = (highlightIndex) => {
        const nextHighlights = formData.highlights.filter((_, i) => i !== highlightIndex);
        setFormData({
            ...formData,
            highlights: nextHighlights.length ? nextHighlights : [''],
        });
    };

    return (
        <div className="p-10">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Pricing Manager</h1>
                    <p className="text-gray-400">Manage pricing plans for all services.</p>
                </div>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditingServiceId(null);
                        setFormData({
                            serviceTitle: '',
                            description: '',
                            highlights: [''],
                            tiers: [{ name: 'Starter', price: '', period: '/month', features: [''], highlight: false }],
                        });
                    }}
                    className="flex items-center gap-2 bg-accent px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
                >
                    <Plus size={20} /> ADD PRICING PLAN
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {pricingData.map((pricing) => (
                    <div key={pricing._id} className="glass rounded-3xl overflow-hidden border border-white/5 relative">
                        <div className="p-8 flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <DollarSign size={28} className="text-accent" />
                                    <h3 className="text-2xl font-bold text-white">{pricing.serviceTitle}</h3>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">{pricing.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {pricing.tiers?.map((tier, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-lg p-3">
                                            <div className="text-accent uppercase text-xs font-bold mb-1">{tier.name}</div>
                                            <div className="text-lg font-bold">{tier.price}</div>
                                            <div className="text-xs text-gray-400">{tier.period}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingServiceId(pricing._id);
                                        setFormData(toFormData(pricing));
                                        setIsModalOpen(true);
                                    }}
                                    className="p-3 bg-white text-black rounded-full hover:bg-accent transition-all"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => deletePricing(pricing._id)}
                                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
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
                            <div className="sticky top-0 bg-linear-to-b from-[#0d1117] to-[#0d1117]/90 border-b border-white/10 px-8 py-6 z-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{editingServiceId ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</h2>
                                    <p className="text-gray-400 text-sm mt-1">Manage pricing tiers and features</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 pb-28">
                                <div className="space-y-8 max-w-3xl mx-auto">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Service Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g., Social Media Management"
                                            value={formData.serviceTitle}
                                            onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Description</label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-white/10 focus:ring-2 focus:ring-accent/20 text-white font-medium transition-all resize-none"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Highlights</label>
                                                <p className="text-gray-400 text-sm mt-1">Add short key points shown in the pricing section</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addHighlight}
                                                className="px-4 py-2 bg-linear-to-r from-accent/30 to-blue-500/20 border-2 border-accent/50 rounded-lg text-accent font-bold text-sm hover:from-accent/40 hover:to-blue-500/30 hover:border-accent transition-all"
                                            >
                                                + Add Highlight
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {formData.highlights.map((highlight, idx) => (
                                                <div key={idx} className="flex items-center gap-2 group">
                                                    <input
                                                        type="text"
                                                        value={highlight}
                                                        onChange={(e) => {
                                                            const nextHighlights = [...formData.highlights];
                                                            nextHighlights[idx] = e.target.value;
                                                            setFormData({ ...formData, highlights: nextHighlights });
                                                        }}
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent focus:bg-black/40 text-white placeholder-gray-500 text-sm transition-all"
                                                        placeholder="Highlight"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeHighlight(idx)}
                                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-white/20 pt-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                    <DollarSign size={22} className="text-accent" />
                                                    Pricing Tiers
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">Create and manage service pricing options</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addTier}
                                                className="px-4 py-2 bg-linear-to-r from-accent/30 to-blue-500/20 border-2 border-accent/50 rounded-lg text-accent font-bold text-sm hover:from-accent/40 hover:to-blue-500/30 hover:border-accent transition-all"
                                            >
                                                + Add Tier
                                            </button>
                                        </div>

                                        <div className="space-y-5">
                                            {formData.tiers.map((tier, tierIdx) => (
                                                <div key={tierIdx} className="bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 relative group hover:border-accent/50 transition-all">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTier(tierIdx)}
                                                        className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X size={18} />
                                                    </button>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 pr-8">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Tier Name</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g., Starter"
                                                                value={tier.name}
                                                                onChange={(e) => {
                                                                    const newTiers = [...formData.tiers];
                                                                    newTiers[tierIdx].name = e.target.value;
                                                                    setFormData({ ...formData, tiers: newTiers });
                                                                }}
                                                                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-accent focus:bg-black/50 text-white font-medium transition-all"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Price (₹/month)</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g., 5,999"
                                                                value={tier.price}
                                                                onChange={(e) => {
                                                                    const newTiers = [...formData.tiers];
                                                                    newTiers[tierIdx].price = e.target.value;
                                                                    setFormData({ ...formData, tiers: newTiers });
                                                                }}
                                                                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-accent focus:bg-black/50 text-white font-medium transition-all"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Period</label>
                                                            <select
                                                                value={tier.period}
                                                                onChange={(e) => {
                                                                    const newTiers = [...formData.tiers];
                                                                    newTiers[tierIdx].period = e.target.value;
                                                                    setFormData({ ...formData, tiers: newTiers });
                                                                }}
                                                                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-accent focus:bg-black/50 text-white font-medium transition-all"
                                                            >
                                                                <option className="bg-black">/month</option>
                                                                <option className="bg-black">/reel</option>
                                                                <option className="bg-black">/campaign</option>
                                                                <option className="bg-black">one-time</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <label className="flex items-center gap-3 cursor-pointer w-full bg-accent/10 rounded-lg px-4 py-3 border border-accent/30 hover:border-accent/60 transition-all mb-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!tier.highlight}
                                                            onChange={(e) => {
                                                                const newTiers = [...formData.tiers];
                                                                newTiers[tierIdx].highlight = e.target.checked;
                                                                setFormData({ ...formData, tiers: newTiers });
                                                            }}
                                                            className="w-5 h-5 accent-accent cursor-pointer rounded"
                                                        />
                                                        <span className="text-xs font-bold text-gray-200 uppercase tracking-wide">Featured</span>
                                                    </label>

                                                    <div className="border-t border-white/10 pt-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Features</label>
                                                            <button
                                                                type="button"
                                                                onClick={() => addFeature(tierIdx)}
                                                                className="text-xs text-accent font-bold hover:text-blue-300 transition-colors"
                                                            >
                                                                + Add Feature
                                                            </button>
                                                        </div>
                                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                                            {tier.features.map((feature, fIdx) => (
                                                                <div key={fIdx} className="flex items-center gap-2 group">
                                                                    <span className="text-accent text-lg leading-none">✓</span>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Feature description"
                                                                        value={feature}
                                                                        onChange={(e) => {
                                                                            const newTiers = [...formData.tiers];
                                                                            newTiers[tierIdx].features[fIdx] = e.target.value;
                                                                            setFormData({ ...formData, tiers: newTiers });
                                                                        }}
                                                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent focus:bg-black/40 text-white placeholder-gray-500 text-sm transition-all"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeFeature(tierIdx, fIdx)}
                                                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                    onClick={handleSubmit}
                                    type="button"
                                    disabled={submitting}
                                    className="px-8 py-3 bg-linear-to-r from-accent to-blue-600 rounded-xl text-white font-bold hover:from-blue-500 hover:to-blue-700 transition-all shadow-lg shadow-accent/30 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Saving...' : editingServiceId ? 'Update Pricing Plan' : 'Create Pricing Plan'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PricingManager;
