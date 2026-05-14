import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageCircle, ArrowRight, Instagram, Facebook, Linkedin, Youtube, Twitter, Hash } from 'lucide-react';
import axios from 'axios';
import { fadeInUp, fadeInLeft, fadeInRight } from '../utils/animations';
import { useSEO, useStructuredData } from '../hooks/useSEO';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';
const leadEndpoint = `${apiBaseUrl}/api/leads`;

const normalizeUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const Contact = () => {
  const [company, setCompany] = useState(null);
  const [projectTypes, setProjectTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '₹5,000 - ₹25,000',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // SEO Meta Tags
  useSEO({
    title: 'Contact Us | Get in Touch with VXR Media House',
    description: 'Ready to grow your brand? Contact VXR Media House for digital marketing, content creation, and branding services in Rajkot. Call +91 96623 96693 or fill the form.',
    keywords: 'contact us, get in touch, digital marketing inquiry, content creation, Rajkot contact, booking, project inquiry',
    image: 'https://vxrmedia.in/og-image.jpg',
    url: 'https://vxrmedia.in/contact',
    type: 'website',
  });

  // Contact page structured data
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact VXR Media House",
    "description": "Get in touch with our team",
    "url": "https://vxrmedia.in/contact",
    "mainEntity": {
      "@type": "Organization",
      "@id": "https://vxrmedia.in/#organization"
    }
  });

  const socialItems = [
    { key: 'instagram', label: 'Instagram', icon: <Instagram size={20} /> },
    { key: 'facebook', label: 'Facebook', icon: <Facebook size={20} /> },
    { key: 'threads', label: 'Threads', icon: <Hash size={20} /> },
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={20} /> },
    { key: 'youtube', label: 'YouTube', icon: <Youtube size={20} /> },
    { key: 'twitter', label: 'Twitter/X', icon: <Twitter size={20} /> },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const [companyRes, servicesRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/company`),
          axios.get(`${apiBaseUrl}/api/services`),
        ]);

        const companyData = companyRes.data || null;
        const serviceTitles = (servicesRes.data || [])
          .map((service) => service.serviceTitle)
          .filter(Boolean);

        const fallbackProjectTypes = ['General Inquiry'];
        const dynamicProjectTypes = serviceTitles.length ? serviceTitles : fallbackProjectTypes;

        setCompany(companyData);
        setProjectTypes(dynamicProjectTypes);
        setFormData((prev) => ({
          ...prev,
          projectType: prev.projectType || dynamicProjectTypes[0],
        }));
      } catch (err) {
        console.error('Error fetching contact page data:', err);
        const fallbackProjectTypes = ['General Inquiry'];
        setProjectTypes(fallbackProjectTypes);
        setFormData((prev) => ({
          ...prev,
          projectType: prev.projectType || fallbackProjectTypes[0],
        }));
      }
    };

    fetchContactData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(leadEndpoint, formData);
      if (res.data.success) {
        setStatus({ type: 'success', message: 'Thank you! We will get back to you soon.' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: projectTypes[0] || 'General Inquiry',
          budget: '₹5,000 - ₹25,000',
          message: ''
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-accent uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-4">Get in Touch</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">LET'S COLLABORATE ON SOMETHING AMAZING</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Reach out by call, WhatsApp, email, or the form below. We'll get back to you within 24 hours.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            {...fadeInLeft}
          >
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent group-hover:from-accent/30 group-hover:to-accent/10 transition-all">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Call Us</h4>
                  <a href={`tel:${company?.phone || ''}`} className="text-xl font-medium hover:text-accent transition-colors">{company?.phone || 'N/A'}</a>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9am - 6pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center text-purple-400 group-hover:from-purple-500/30 group-hover:to-purple-500/10 transition-all">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Email</h4>
                  <a href={`mailto:${company?.email || ''}`} className="text-xl font-medium hover:text-accent transition-colors">{company?.email || 'N/A'}</a>
                  <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center text-green-400 group-hover:from-green-500/30 group-hover:to-green-500/10 transition-all">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp</h4>
                  <a href={`https://wa.me/${company?.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="text-xl font-medium hover:text-green-400 transition-colors inline-flex items-center gap-2">
                    Open Chat <ArrowRight size={16} />
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Fastest response channel</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center text-orange-400 group-hover:from-orange-500/30 group-hover:to-orange-500/10 transition-all">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Studio Location</h4>
                  <p className="text-lg font-medium">{company?.address || 'N/A'}</p>
                  <p className="text-sm text-gray-500 mt-1">{company?.location || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Follow Us</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {socialItems.map((item) => {
                    const href = normalizeUrl(company?.socialLinks?.[item.key]);
                    const isEnabled = Boolean(href);

                    return (
                      <a
                        key={item.key}
                        href={href || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        onClick={(e) => {
                          if (!isEnabled) e.preventDefault();
                        }}
                        className={`rounded-xl border px-4 py-3 flex items-center gap-2 transition-all ${isEnabled ? 'border-white/20 text-gray-200 hover:border-accent/40 hover:text-accent' : 'border-white/10 text-gray-600 cursor-not-allowed'}`}
                        title={isEnabled ? item.label : `${item.label} link not set`}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeInRight}
            className="p-10 glass rounded-3xl border border-white/10 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Project Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent outline-none transition-all appearance-none"
                  >
                    {projectTypes.map((projectType) => (
                      <option key={projectType} className="bg-black">{projectType}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent outline-none transition-all appearance-none"
                  >
                    <option className="bg-black">₹5,000 - ₹25,000</option>
                    <option className="bg-black">₹25,000 - ₹75,000</option>
                    <option className="bg-black">₹75,000 - ₹3,00,000</option>
                    <option className="bg-black">₹3,00,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Message</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent outline-none transition-all"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? 'SENDING...' : 'SEND MESSAGE'} <Send size={20} />
              </button>

              {status.message && (
                <div className={`text-center p-4 rounded-xl ${status.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {status.message}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
