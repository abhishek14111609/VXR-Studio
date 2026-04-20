import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, DollarSign } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

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
                            className="bg-[#0d1117] border border-white/10 p-10 rounded-3xl w-full max-w-3xl relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                                <X size={28} />
                            </button>
                            <h2 className="text-2xl font-bold mb-8">{editingServiceId ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Service Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., Social Media Management"
                                        value={formData.serviceTitle}
                                        onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Description</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-gray-400 uppercase">Highlights</label>
                                        <button
                                            type="button"
                                            onClick={addHighlight}
                                            className="text-xs text-accent font-bold hover:underline"
                                        >
                                            + Add Highlight
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.highlights.map((highlight, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={highlight}
                                                    onChange={(e) => {
                                                        const nextHighlights = [...formData.highlights];
                                                        nextHighlights[idx] = e.target.value;
                                                        setFormData({ ...formData, highlights: nextHighlights });
                                                    }}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-accent"
                                                    placeholder="Highlight"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeHighlight(idx)}
                                                    className="px-2 text-red-400 hover:bg-red-400/10 rounded"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-bold text-gray-400 uppercase">Pricing Tiers</label>
                                        <button
                                            type="button"
                                            onClick={addTier}
                                            className="px-3 py-1 bg-accent/20 border border-accent rounded-lg text-accent font-bold text-sm hover:bg-accent/30"
                                        >
                                            + Add Tier
                                        </button>
                                    </div>

                                    <div className="space-y-6 max-h-96 overflow-y-auto">
                                        {formData.tiers.map((tier, tierIdx) => (
                                            <div key={tierIdx} className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
                                                <button
                                                    type="button"
                                                    onClick={() => removeTier(tierIdx)}
                                                    className="absolute top-3 right-3 text-red-400 hover:bg-red-400/10 p-1 rounded"
                                                >
                                                    <X size={18} />
                                                </button>

                                                <div className="grid grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 mb-1">Tier Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Starter"
                                                            value={tier.name}
                                                            onChange={(e) => {
                                                                const newTiers = [...formData.tiers];
                                                                newTiers[tierIdx].name = e.target.value;
                                                                setFormData({ ...formData, tiers: newTiers });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 mb-1">Price (₹)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., 5,999"
                                                            value={tier.price}
                                                            onChange={(e) => {
                                                                const newTiers = [...formData.tiers];
                                                                newTiers[tierIdx].price = e.target.value;
                                                                setFormData({ ...formData, tiers: newTiers });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 mb-1">Period</label>
                                                        <select
                                                            value={tier.period}
                                                            onChange={(e) => {
                                                                const newTiers = [...formData.tiers];
                                                                newTiers[tierIdx].period = e.target.value;
                                                                setFormData({ ...formData, tiers: newTiers });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                                        >
                                                            <option className="bg-black">/month</option>
                                                            <option className="bg-black">/reel</option>
                                                            <option className="bg-black">/campaign</option>
                                                            <option className="bg-black">one-time</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <label className="inline-flex items-center gap-2 mb-4 text-xs text-gray-300">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!tier.highlight}
                                                        onChange={(e) => {
                                                            const newTiers = [...formData.tiers];
                                                            newTiers[tierIdx].highlight = e.target.checked;
                                                            setFormData({ ...formData, tiers: newTiers });
                                                        }}
                                                    />
                                                    Mark as most popular
                                                </label>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-bold text-gray-400">Features</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addFeature(tierIdx)}
                                                            className="text-xs text-accent font-bold hover:underline"
                                                        >
                                                            + Add
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {tier.features.map((feature, fIdx) => (
                                                            <div key={fIdx} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Feature description"
                                                                    value={feature}
                                                                    onChange={(e) => {
                                                                        const newTiers = [...formData.tiers];
                                                                        newTiers[tierIdx].features[fIdx] = e.target.value;
                                                                        setFormData({ ...formData, tiers: newTiers });
                                                                    }}
                                                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFeature(tierIdx, fIdx)}
                                                                    className="px-2 text-red-400 hover:bg-red-400/10 rounded"
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

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all"
                                >
                                    {submitting ? 'Saving...' : editingServiceId ? 'Update Pricing Plan' : 'Create Pricing Plan'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PricingManager;
