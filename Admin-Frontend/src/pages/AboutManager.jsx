import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, AlertCircle } from 'lucide-react';

const AboutManager = () => {
    const [abouthData, setAboutData] = useState({
        companyName: 'VXR Media House',
        tagline: 'Social-first creative, media, and advertising solutions that convert.',
        mission: 'To deliver social-first creative solutions that drive engagement, conversions, and measurable growth for brands.',
        vision: 'To be the go-to partner for businesses seeking authentic, results-driven digital marketing.',
        phone: '96623 96693',
        email: 'vxrmediaa@gmail.com',
        whatsapp: '919662396693',
        address: '304 B, 3rd Floor, 4 Plus Complex, Opposite Poojara Telecom, Astron Chowk, Rajkot',
        location: 'Rajkot, Gujarat, India',
        benefits: [
            { title: 'Results-Driven', description: 'Every campaign is built with measurable KPIs and ROI focus.' },
            { title: 'Growth-Focused', description: 'We scale what works and pivot on data, not guesses.' },
            { title: 'Collaborative', description: 'Your team is our team. We communicate, iterate, and improve together.' },
            { title: 'Fast Execution', description: 'Ideas to execution in days, not weeks. Agile and responsive.' }
        ]
    });

    const [saved, setSaved] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('aboutData');
        if (saved) {
            setAboutData(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('aboutData', JSON.stringify(abouthData));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const updateBenefit = (index, field, value) => {
        const newBenefits = [...abouthData.benefits];
        newBenefits[index][field] = value;
        setAboutData({ ...abouthData, benefits: newBenefits });
    };

    const addBenefit = () => {
        setAboutData({
            ...abouthData,
            benefits: [...abouthData.benefits, { title: '', description: '' }]
        });
    };

    const removeBenefit = (index) => {
        setAboutData({
            ...abouthData,
            benefits: abouthData.benefits.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="p-10">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2">About Us Manager</h1>
                <p className="text-gray-400">Manage company information and company details.</p>
            </div>

            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3"
                >
                    <AlertCircle size={20} className="text-green-400" />
                    <span className="text-green-300 font-semibold">Changes saved successfully!</span>
                </motion.div>
            )}

            <div className="glass rounded-3xl border border-white/10 p-10 space-y-8">
                {/* Company Info Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-accent uppercase tracking-wider">Company Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Company Name</label>
                            <input
                                type="text"
                                value={abouthData.companyName}
                                onChange={(e) => setAboutData({ ...abouthData, companyName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Tagline</label>
                            <input
                                type="text"
                                value={abouthData.tagline}
                                onChange={(e) => setAboutData({ ...abouthData, tagline: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Mission</label>
                        <textarea
                            value={abouthData.mission}
                            onChange={(e) => setAboutData({ ...abouthData, mission: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Vision</label>
                        <textarea
                            value={abouthData.vision}
                            onChange={(e) => setAboutData({ ...abouthData, vision: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            rows="3"
                        />
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="border-t border-white/10 pt-8 space-y-6">
                    <h2 className="text-2xl font-bold text-accent uppercase tracking-wider">Contact Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Phone</label>
                            <input
                                type="tel"
                                value={abouthData.phone}
                                onChange={(e) => setAboutData({ ...abouthData, phone: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Email</label>
                            <input
                                type="email"
                                value={abouthData.email}
                                onChange={(e) => setAboutData({ ...abouthData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">WhatsApp Number</label>
                            <input
                                type="tel"
                                value={abouthData.whatsapp}
                                onChange={(e) => setAboutData({ ...abouthData, whatsapp: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Location</label>
                            <input
                                type="text"
                                value={abouthData.location}
                                onChange={(e) => setAboutData({ ...abouthData, location: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Full Address</label>
                        <textarea
                            value={abouthData.address}
                            onChange={(e) => setAboutData({ ...abouthData, address: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            rows="2"
                        />
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="border-t border-white/10 pt-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-accent uppercase tracking-wider">Company Benefits</h2>
                        <button
                            onClick={addBenefit}
                            className="px-4 py-2 bg-accent/20 border border-accent rounded-lg text-accent font-bold text-sm hover:bg-accent/30 transition-all"
                        >
                            + Add Benefit
                        </button>
                    </div>

                    <div className="space-y-4">
                        {abouthData.benefits.map((benefit, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
                                {abouthData.benefits.length > 1 && (
                                    <button
                                        onClick={() => removeBenefit(index)}
                                        className="absolute top-3 right-3 text-red-400 hover:bg-red-400/10 p-2 rounded"
                                    >
                                        ✕
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Results-Driven"
                                            value={benefit.title}
                                            onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Description</label>
                                        <input
                                            type="text"
                                            placeholder="Benefit description"
                                            value={benefit.description}
                                            onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="border-t border-white/10 pt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-accent text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-all"
                    >
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutManager;
