import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
import BrandMark from './BrandMark';
import { company } from '../utils/siteContent';
import { containerVariants, itemVariants } from '../utils/animations';

const Footer = () => {
  return (
    <footer className="bg-black py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <BrandMark />
            <p className="text-gray-400 max-w-md leading-relaxed">
              {company.tagline}
            </p>
            <div className="space-y-3 text-gray-300">
              <a href={`tel:${company.phoneLink}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone size={18} className="text-accent" />
                <span>{company.phoneDisplay}</span>
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail size={18} className="text-accent" />
                <span>{company.email}</span>
              </a>
              <p className="flex items-start gap-3 text-gray-300">
                <MapPin size={18} className="text-accent mt-1 shrink-0" />
                <span>{company.address}</span>
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">QUICK LINKS</h4>
            <div className="flex flex-col space-y-4">
              <Link to="/portfolio" className="text-gray-400 hover:text-accent transition-colors">Portfolio</Link>
              <Link to="/services" className="text-gray-400 hover:text-accent transition-colors">Services</Link>
              <Link to="/about" className="text-gray-400 hover:text-accent transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">DIRECT CONTACT</h4>
            <div className="space-y-4 text-gray-400">
              <a href={company.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                <MessageCircle size={18} className="text-green-400" />
                <span>WhatsApp us anytime</span>
              </a>
              <p>Fast replies for content, ads, branding, and campaign support.</p>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
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
