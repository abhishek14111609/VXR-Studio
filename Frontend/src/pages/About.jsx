import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Zap, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { fadeInUp, fadeInLeft, fadeInRight, containerVariants, itemVariants } from '../utils/animations';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const defaultBenefits = [
  {
    title: 'Results-Driven',
    description: 'Every campaign is built around measurable KPIs and conversion goals.',
  },
  {
    title: 'Growth-Focused',
    description: 'We optimize continuously to ensure your ROI keeps climbing.',
  },
  {
    title: 'Collaborative',
    description: 'We work as an extension of your team with transparent communication.',
  },
  {
    title: 'Fast Execution',
    description: '24-hour response time and quick campaign launches to capitalize on trends.',
  },
];

const About = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/company`);
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-accent">Loading...</div>
      </div>
    );
  }

  const benefits = company?.benefits?.length ? company.benefits : defaultBenefits;

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div {...fadeInLeft}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter"
            >
              WE ARE <br /> <span className="text-accent">{company?.companyName || 'VXR MEDIA HOUSE'}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-xl leading-relaxed mb-8"
            >
              {company?.tagline || 'Born from a focus on performance and storytelling, we help brands grow through content, ads, design, and conversion-led marketing.'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg leading-relaxed mb-12"
            >
              We build systems that make your brand easier to remember, easier to trust, and easier to buy from. Everything is shaped around the customer journey, not just the feed.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-12"
            >
              <div className="group">
                <h4 className="text-4xl font-bold mb-2 text-accent group-hover:scale-110 transition-transform">8</h4>
                <p className="text-gray-500 uppercase tracking-widest text-xs">Core Services</p>
              </div>
              <div className="group">
                <h4 className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">24h</h4>
                <p className="text-gray-500 uppercase tracking-widest text-xs">Response Time</p>
              </div>
              <div className="group">
                <h4 className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">RAJKOT</h4>
                <p className="text-gray-500 uppercase tracking-widest text-xs">Based In</p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            {...fadeInRight}
            className="aspect-4/5 bg-gradient-to-br from-accent/20 to-purple-600/20 rounded-3xl overflow-hidden relative group border border-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
              alt="Team working"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            {...fadeInLeft}
            className="p-12 glass rounded-3xl border border-white/10 group hover:border-accent/40 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target size={28} className="text-accent group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-accent">OUR MISSION</h3>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              {company?.mission || 'To help businesses grow with content and campaigns that are built to attract attention, earn trust, and convert.'}
            </p>
          </motion.div>
          <motion.div
            {...fadeInRight}
            className="p-12 glass rounded-3xl border border-white/10 group hover:border-accent/40 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap size={28} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-purple-400">OUR VISION</h3>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              {company?.vision || 'To be the most reliable creative and digital growth partner for brands that want strong identity and measurable results.'}
            </p>
          </motion.div>
        </div>

        <motion.div {...fadeInUp} className="mb-20">
          <h3 className="text-4xl font-bold text-center mb-16">Why Choose VXR Media House</h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, idx) => {
              const icons = [
                <CheckCircle2 size={28} key="icon-check" />,
                <TrendingUp size={28} key="icon-trending" />,
                <Users size={28} key="icon-users" />,
                <Zap size={28} key="icon-zap" />,
              ];

              return (
                <motion.div
                  key={benefit.title || idx}
                  variants={itemVariants}
                  className="p-8 rounded-2xl glass border border-white/10 group hover:border-accent/40 hover:bg-accent/5 transition-all"
                >
                  <div className="text-accent mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    {icons[idx % icons.length]}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
