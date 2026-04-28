import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck, ArrowRight, Zap } from 'lucide-react';
import { fadeInUp, containerVariants, itemVariants } from '../utils/animations';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const Pricing = () => {
    const [expandedService, setExpandedService] = useState(0);
    const [pricingPlans, setPricingPlans] = useState([]);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [servicesRes, companyRes] = await Promise.all([
                axios.get(`${apiBaseUrl}/api/services`),
                axios.get(`${apiBaseUrl}/api/company`)
            ]);
            setPricingPlans(servicesRes.data);
            setCompany(companyRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
                <div className="text-2xl font-bold text-accent">Loading pricing...</div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                    className="text-center mb-20"
                >
                    <p className="text-accent uppercase tracking-[0.45em] text-xs md:text-sm font-bold mb-5">TRANSPARENT PRICING</p>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">PLANS FOR EVERY BUDGET & GOAL</h1>
                    <p className="text-gray-400 text-xl max-w-3xl mx-auto">Choose the tier that fits your needs, or mix and match services to create the perfect package for your brand.</p>
                </motion.div>

                {/* Services Accordion + Pricing Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '0px 0px -50px 0px' }}
                    className="space-y-6 mb-20"
                >
                    {pricingPlans.map((plan, serviceIndex) => (
                        <motion.div
                            key={serviceIndex}
                            variants={itemVariants}
                            className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all"
                            whileHover={{ boxShadow: '0 30px 60px rgba(59, 130, 246, 0.1)' }}
                        >
                            {/* Service Header */}
                            <button
                                onClick={() =>
                                    setExpandedService(
                                        expandedService === serviceIndex ? -1 : serviceIndex
                                    )
                                }
                                className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-4 text-left flex-1">
                                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-accent transition-colors">
                                        {plan.serviceTitle}
                                    </h3>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedService === serviceIndex ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    <ChevronDown className="w-6 h-6 text-accent" />
                                </motion.div>
                            </button>

                            {/* Pricing Tiers - Expanded */}
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: expandedService === serviceIndex ? 'auto' : 0,
                                    opacity: expandedService === serviceIndex ? 1 : 0,
                                }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 md:p-8 border-t border-white/10 bg-gradient-to-r from-white/5 to-accent/5">
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {plan.tiers.map((tier, tierIndex) => (
                                            <motion.div
                                                key={tierIndex}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{
                                                    opacity: expandedService === serviceIndex ? 1 : 0,
                                                    y: expandedService === serviceIndex ? 0 : 20,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: tierIndex * 0.1,
                                                }}
                                                whileHover={!tier.highlight ? { y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' } : {}}
                                                className={`relative p-8 rounded-3xl border transition-all group h-full flex flex-col ${tier.highlight
                                                    ? 'bg-gradient-to-br from-accent/20 to-accent/10 border-accent/50 ring-2 ring-accent/30'
                                                    : 'bg-white/5 border-white/10 hover:border-accent/30'
                                                    }`}
                                            >
                                                {/* Highlight Badge */}
                                                {tier.highlight && (
                                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                                                        <span className="inline-block bg-gradient-to-r from-accent to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap">
                                                            Most Popular
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Tier Content */}
                                                <div className="mb-6 pt-4">
                                                    <p className="text-accent uppercase tracking-[0.35em] text-xs font-bold mb-3 block">
                                                        {tier.name}
                                                    </p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-4xl md:text-5xl font-bold">
                                                            {tier.price}
                                                        </span>
                                                        <span className="text-gray-400 text-sm leading-tight">
                                                            {tier.period}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Features List */}
                                                <div className="space-y-3 mb-8 pb-8 border-b border-white/10 flex-grow">
                                                    {(tier.features || []).map((feature, featureIndex) => {
                                                        const featureText = typeof feature === 'string' ? feature : feature?.text;
                                                        if (!featureText) return null;

                                                        return (
                                                            <div
                                                                key={`${featureText}-${featureIndex}`}
                                                                className="flex items-start gap-3 text-gray-300 group/item"
                                                            >
                                                                <span className="h-2 w-2 rounded-full bg-accent shrink-0 flex-shrink-0 mt-1.5" />
                                                                <span className="text-sm leading-relaxed">{featureText}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* CTA Button */}
                                                <a
                                                    href={`https://wa.me/${company?.whatsapp || ''}?text=I'm%20interested%20in%20the%20${tier.name}%20plan%20for%20${plan.serviceTitle}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all transform hover:scale-105 ${tier.highlight
                                                        ? 'bg-gradient-to-r from-accent to-blue-600 text-white hover:shadow-lg hover:shadow-accent/50'
                                                        : 'bg-white/5 text-accent border border-accent/30 hover:bg-white/10'
                                                        }`}
                                                >
                                                    Get Started <ArrowRight size={14} />
                                                </a>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    {...fadeInUp}
                    className="flex flex-col lg:flex-row items-center justify-between gap-12 p-12 rounded-3xl glass border border-white/10 bg-gradient-to-r from-accent/10 to-purple-600/10 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-bold mb-3">Custom Requirements?</h3>
                        <p className="text-gray-400 max-w-2xl">Need something different? Share your vision, timeline, and budget. We'll craft the perfect package tailored to your goals.</p>
                    </div>
                    <a
                        href={`https://wa.me/${company?.whatsapp || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-accent/50 transition-all transform hover:scale-105 whitespace-nowrap"
                    >
                        Talk to Us <ArrowRight size={20} />
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

// Chevron Icon for expandable
const ChevronDown = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

export default Pricing;
