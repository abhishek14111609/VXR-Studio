import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Linkedin, Youtube, Twitter, Hash } from 'lucide-react';
import axios from 'axios';
import BrandMark from './BrandMark';
import { company } from '../utils/siteContent';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const normalizeUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const Footer = () => {
  const [companyData, setCompanyData] = useState(company);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/company`);
        setCompanyData((prev) => ({
          ...prev,
          ...data,
          socialLinks: data?.socialLinks || {},
        }));
      } catch (err) {
        console.error('Failed to load footer company data:', err);
      }
    };

    fetchCompanyData();
  }, []);

  const socialItems = [
    { key: 'instagram', label: 'Instagram', icon: <Instagram size={18} /> },
    { key: 'facebook', label: 'Facebook', icon: <Facebook size={18} /> },
    { key: 'threads', label: 'Threads', icon: <Hash size={18} /> },
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={18} /> },
    { key: 'youtube', label: 'YouTube', icon: <Youtube size={18} /> },
    { key: 'twitter', label: 'Twitter/X', icon: <Twitter size={18} /> },
  ];

  return (
    <footer className="bg-black py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-2 space-y-6 min-w-0">
            <BrandMark variant="wordmark" />
            <p className="text-gray-400 max-w-md leading-relaxed">
              {companyData?.tagline || company.tagline}
            </p>
            <div className="space-y-3 text-gray-300">
              <a href={`tel:${companyData?.phone || company.phoneLink}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone size={18} className="text-accent" />
                <span>{companyData?.phone || company.phoneDisplay}</span>
              </a>
              <a href={`mailto:${companyData?.email || company.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail size={18} className="text-accent" />
                <span>{companyData?.email || company.email}</span>
              </a>
              <p className="flex items-start gap-3 text-gray-300">
                <MapPin size={18} className="text-accent mt-1 shrink-0" />
                <span>{companyData?.address || company.address}</span>
              </p>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-bold mb-6">QUICK LINKS</h4>
            <div className="flex flex-col space-y-4">
              <Link to="/portfolio" className="text-gray-400 hover:text-accent transition-colors">Portfolio</Link>
              <Link to="/services" className="text-gray-400 hover:text-accent transition-colors">Services</Link>
              <Link to="/about" className="text-gray-400 hover:text-accent transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors">Contact</Link>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-bold mb-6">DIRECT CONTACT</h4>
            <div className="space-y-4 text-gray-400">
              <a href={`https://wa.me/${companyData?.whatsapp || company.whatsappNumber || ''}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                <MessageCircle size={18} className="text-green-400" />
                <span>WhatsApp us anytime</span>
              </a>
              <p>Fast replies for content, ads, branding, and campaign support.</p>

              <div className="pt-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Follow Us</p>
                <div className="flex flex-wrap gap-2">
                  {socialItems.map((item) => {
                    const href = normalizeUrl(companyData?.socialLinks?.[item.key]);
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
                        className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all ${isEnabled ? 'border-white/20 text-gray-300 hover:text-accent hover:border-accent/40' : 'border-white/10 text-gray-600 cursor-not-allowed'}`}
                        title={isEnabled ? item.label : `${item.label} link not set`}
                      >
                        {item.icon}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm text-center md:text-left">
          <p>© {new Date().getFullYear()} {companyData?.companyName || company.name}. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
