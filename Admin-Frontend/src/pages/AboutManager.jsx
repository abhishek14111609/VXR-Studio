import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Save, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const initialAboutData = {
    companyName: 'VXR Media House',
    tagline: 'Social-first creative, media, and advertising solutions that convert.',
    mission: 'To deliver social-first creative solutions that drive engagement, conversions, and measurable growth for brands.',
    vision: 'To be the go-to partner for businesses seeking authentic, results-driven digital marketing.',
    phone: '96623 96693',
    email: 'vxrmediaa@gmail.com',
    whatsapp: '919662396693',
    address: '304 B, 3rd Floor, 4 Plus Complex, Opposite Poojara Telecom, Astron Chowk, Rajkot',
    location: 'Rajkot, Gujarat, India',
    socialLinks: {
        instagram: '',
        facebook: '',
        threads: '',
        linkedin: '',
        youtube: '',
        twitter: ''
    },
    benefits: [
        { title: 'Results-Driven', description: 'Every campaign is built with measurable KPIs and ROI focus.' },
        { title: 'Growth-Focused', description: 'We scale what works and pivot on data, not guesses.' },
        { title: 'Collaborative', description: 'Your team is our team. We communicate, iterate, and improve together.' },
        { title: 'Fast Execution', description: 'Ideas to execution in days, not weeks. Agile and responsive.' }
    ],
    teamMembers: [
        {
            name: 'Aarav Patel',
            role: 'Creative Director',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
            bio: 'Leads brand storytelling and visual direction across campaigns.'
        },
        {
            name: 'Meera Shah',
            role: 'Performance Marketer',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
            bio: 'Builds and optimizes paid campaigns focused on measurable growth.'
        },
        {
            name: 'Rohan Desai',
            role: 'Video Strategist',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
            bio: 'Designs short-form content systems that improve retention and engagement.'
        }
    ]
};

const AboutManager = () => {
    const [aboutData, setAboutData] = useState(initialAboutData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [error, setError] = useState('');

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/company`);
                setAboutData({
                    ...initialAboutData,
                    ...data,
                    socialLinks: {
                        ...initialAboutData.socialLinks,
                        ...(data?.socialLinks || {})
                    },
                    benefits: data?.benefits?.length ? data.benefits : initialAboutData.benefits,
                    teamMembers: data?.teamMembers?.length ? data.teamMembers : initialAboutData.teamMembers,
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load company information.');
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    const handleSave = async () => {
        const token = JSON.parse(localStorage.getItem('adminUser') || 'null')?.token;
        setSaving(true);
        setError('');

        const { _id, __v, createdAt, updatedAt, ...payload } = aboutData;

        try {
            const { data } = await axios.put(`${API_BASE_URL}/api/company`, payload, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });
            setAboutData({
                ...initialAboutData,
                ...data,
                socialLinks: {
                    ...initialAboutData.socialLinks,
                    ...(data?.socialLinks || {})
                },
                benefits: data?.benefits?.length ? data.benefits : initialAboutData.benefits,
                teamMembers: data?.teamMembers?.length ? data.teamMembers : initialAboutData.teamMembers,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save company information.');
        } finally {
            setSaving(false);
        }
    };

    const updateBenefit = (index, field, value) => {
        const newBenefits = [...aboutData.benefits];
        newBenefits[index][field] = value;
        setAboutData({ ...aboutData, benefits: newBenefits });
    };

    const addBenefit = () => {
        setAboutData({
            ...aboutData,
            benefits: [...aboutData.benefits, { title: '', description: '' }]
        });
    };

    const removeBenefit = (index) => {
        setAboutData({
            ...aboutData,
            benefits: aboutData.benefits.filter((_, i) => i !== index)
        });
    };

    const updateTeamMember = (index, field, value) => {
        const nextMembers = [...aboutData.teamMembers];
        nextMembers[index][field] = value;
        setAboutData({ ...aboutData, teamMembers: nextMembers });
    };

    const addTeamMember = () => {
        setAboutData({
            ...aboutData,
            teamMembers: [...aboutData.teamMembers, { name: '', role: '', image: '', bio: '' }]
        });
    };

    const removeTeamMember = (index) => {
        setAboutData({
            ...aboutData,
            teamMembers: aboutData.teamMembers.filter((_, i) => i !== index)
        });
    };

    const handleTeamImageUpload = async (memberIndex, file) => {
        if (!file) {
            return;
        }

        const token = JSON.parse(localStorage.getItem('adminUser') || 'null')?.token;
        const formData = new FormData();
        formData.append('image', file);
        setError('');
        setUploadingIndex(memberIndex);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/upload/team-image`, formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'multipart/form-data'
                }
            });

            updateTeamMember(memberIndex, 'image', data.imageUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload image.');
        } finally {
            setUploadingIndex(null);
        }
    };

    if (loading) {
        return (
            <div className="p-10">
                <div className="glass rounded-3xl border border-white/10 p-10 text-center text-gray-300">
                    Loading About data...
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2">About Us Manager</h1>
                <p className="text-gray-400">Manage company information and team details.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200">
                    {error}
                </div>
            )}

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
                                value={aboutData.companyName}
                                onChange={(e) => setAboutData({ ...aboutData, companyName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Tagline</label>
                            <input
                                type="text"
                                value={aboutData.tagline}
                                onChange={(e) => setAboutData({ ...aboutData, tagline: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Mission</label>
                        <textarea
                            value={aboutData.mission}
                            onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Vision</label>
                        <textarea
                            value={aboutData.vision}
                            onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
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
                                value={aboutData.phone}
                                onChange={(e) => setAboutData({ ...aboutData, phone: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Email</label>
                            <input
                                type="email"
                                value={aboutData.email}
                                onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">WhatsApp Number</label>
                            <input
                                type="tel"
                                value={aboutData.whatsapp}
                                onChange={(e) => setAboutData({ ...aboutData, whatsapp: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Location</label>
                            <input
                                type="text"
                                value={aboutData.location}
                                onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Full Address</label>
                        <textarea
                            value={aboutData.address}
                            onChange={(e) => setAboutData({ ...aboutData, address: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-accent"
                            rows="2"
                        />
                    </div>

                    <div className="border-t border-white/10 pt-6 space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Instagram URL</label>
                                <input
                                    type="text"
                                    placeholder="https://instagram.com/yourhandle"
                                    value={aboutData.socialLinks?.instagram || ''}
                                    onChange={(e) => setAboutData({
                                        ...aboutData,
                                        socialLinks: { ...aboutData.socialLinks, instagram: e.target.value }
                                    })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Facebook URL</label>
                                <input
                                    type="text"
                                    placeholder="https://facebook.com/yourpage"
                                    value={aboutData.socialLinks?.facebook || ''}
                                    onChange={(e) => setAboutData({
                                        ...aboutData,
                                        socialLinks: { ...aboutData.socialLinks, facebook: e.target.value }
                                    })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Threads URL</label>
                                <input
                                    type="text"
                                    placeholder="https://threads.net/@yourhandle"
                                    value={aboutData.socialLinks?.threads || ''}
                                    onChange={(e) => setAboutData({
                                        ...aboutData,
                                        socialLinks: { ...aboutData.socialLinks, threads: e.target.value }
                                    })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">LinkedIn URL</label>
                                <input
                                    type="text"
                                    placeholder="https://linkedin.com/company/yourcompany"
                                    value={aboutData.socialLinks?.linkedin || ''}
                                    onChange={(e) => setAboutData({
                                        ...aboutData,
                                        socialLinks: { ...aboutData.socialLinks, linkedin: e.target.value }
                                    })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">YouTube URL</label>
                                <input
                                    type="text"
                                    placeholder="https://youtube.com/@yourchannel"
                                    value={aboutData.socialLinks?.youtube || ''}
                                    onChange={(e) => setAboutData({
                                        ...aboutData,
                                        socialLinks: { ...aboutData.socialLinks, youtube: e.target.value }
                                    })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Twitter/X URL</label>
                                <input
                                    type="text"
                                    placeholder="https://x.com/yourhandle"
                                    value={aboutData.socialLinks?.twitter || ''}
                                    onChange={(e) => setAboutData({
                                        ...aboutData,
                                        socialLinks: { ...aboutData.socialLinks, twitter: e.target.value }
                                    })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                />
                            </div>
                        </div>
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
                        {aboutData.benefits.map((benefit, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
                                {aboutData.benefits.length > 1 && (
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

                {/* Team Section */}
                <div className="border-t border-white/10 pt-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-accent uppercase tracking-wider">Our Team</h2>
                        <button
                            onClick={addTeamMember}
                            className="px-4 py-2 bg-accent/20 border border-accent rounded-lg text-accent font-bold text-sm hover:bg-accent/30 transition-all"
                        >
                            + Add Team Member
                        </button>
                    </div>

                    <div className="space-y-4">
                        {aboutData.teamMembers.map((member, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
                                {aboutData.teamMembers.length > 1 && (
                                    <button
                                        onClick={() => removeTeamMember(index)}
                                        className="absolute top-3 right-3 text-red-400 hover:bg-red-400/10 p-2 rounded"
                                    >
                                        ✕
                                    </button>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Aarav Patel"
                                            value={member.name}
                                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Role</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Creative Director"
                                            value={member.role}
                                            onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Team Image</label>
                                        <div className="space-y-2">
                                            {member.image && (
                                                <img
                                                    src={member.image}
                                                    alt={member.name || 'Team preview'}
                                                    className="h-28 w-28 object-cover rounded-lg border border-white/10"
                                                />
                                            )}
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleTeamImageUpload(index, e.target.files?.[0])}
                                                    className="block w-full text-xs text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-accent/20 file:px-3 file:py-2 file:font-semibold file:text-accent hover:file:bg-accent/30"
                                                />
                                                {uploadingIndex === index && (
                                                    <span className="text-xs text-accent font-semibold">Uploading...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Bio</label>
                                        <textarea
                                            rows="2"
                                            placeholder="Short introduction"
                                            value={member.bio}
                                            onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
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
                        disabled={saving}
                        className="flex items-center gap-2 bg-accent text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-all"
                    >
                        <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutManager;
