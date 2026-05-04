import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fadeInUp, containerVariants, itemVariants } from '../utils/animations';
import { useSEO, useStructuredData } from '../hooks/useSEO';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEO Meta Tags
  useSEO({
    title: 'Premium Services | Social Media, Meta Ads & Branding | VXR Media House',
    description: 'Explore our comprehensive digital marketing services: social media management, Meta ads, graphic design, video editing, reels, influencer marketing & branding in Rajkot.',
    keywords: 'digital marketing services, social media management, Meta ads, graphic design, video editing, reels editing, branding services, content creation services, Rajkot',
    image: 'https://vxrmedia.in/og-image.jpg',
    url: 'https://vxrmedia.in/services',
    type: 'website',
  });

  // Services page structured data
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Digital Marketing Services",
    "description": "Professional digital marketing and content creation services",
    "url": "https://vxrmedia.in/services"
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/services`);
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-accent">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          className="text-center mb-20"
        >
          <p className="text-accent uppercase tracking-[0.45em] text-xs md:text-sm font-bold mb-5">Services & Packages</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">BUILT FOR GROWTH, NOT GENERIC PROMISES</h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">Flexible packages for content, ads, branding, and promotions. We tailor every scope to the brand, the platform, and the goal.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -50px 0px' }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-20"
        >
          {services.map((service, index) => (
            <motion.div
              key={service._id || service.serviceTitle || index}
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: '0 30px 60px rgba(59, 130, 246, 0.2)' }}
              className={`p-8 rounded-3xl border transition-all backdrop-blur-md group ${index % 3 === 1
                ? 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/40 md:scale-105'
                : 'glass border-white/10 hover:border-accent/40'
                }`}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-accent uppercase tracking-[0.35em] text-xs font-bold mb-3">0{index + 1}</p>
                  <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">{service.serviceTitle}</h2>
                </div>
                <Zap size={24} className="text-accent shrink-0 mt-1 group-hover:scale-110 transition-transform" />
              </div>

              <div className="space-y-3 mb-8 pb-8 border-b border-white/10">
                {(service.highlights || []).map((highlight, idx) => {
                  const highlightText = typeof highlight === 'string' ? highlight : highlight?.text;
                  if (!highlightText) return null;

                  return (
                    <div key={`${highlightText}-${idx}`} className="flex items-center gap-3 text-gray-300 group/item">
                      <span className="h-2 w-2 rounded-full bg-accent shrink-0 group-hover/item:scale-150 transition-transform" />
                      <span>{highlightText}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm uppercase tracking-[0.35em] text-gray-500 group-hover:text-accent/80 transition-colors">Custom package available on request</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          {...fadeInUp}
          className="flex flex-col lg:flex-row items-center justify-between gap-12 p-12 rounded-3xl glass border border-white/10 bg-gradient-to-r from-accent/10 to-purple-600/10 relative overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">Ready to Grow?</h3>
            <p className="text-gray-400 max-w-2xl">Share your goal, timeline, and budget. We shape the service mix around your campaign instead of forcing you into a preset plan.</p>
          </div>
          <Link to="/contact" className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-accent/50 transition-all transform hover:scale-105 whitespace-nowrap">
            Let's Talk <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
