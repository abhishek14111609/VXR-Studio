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

const defaultTeamMembers = [
  {
    name: 'Aarav Patel',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    bio: 'Leads brand storytelling and visual direction across campaigns.',
  },
  {
    name: 'Meera Shah',
    role: 'Performance Marketer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    bio: 'Builds and optimizes paid campaigns focused on measurable growth.',
  },
  {
    name: 'Rohan Desai',
    role: 'Video Strategist',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    bio: 'Designs short-form content systems that improve retention and engagement.',
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
  const teamMembers = company?.teamMembers?.length ? company.teamMembers : defaultTeamMembers;
  const founderIndex = teamMembers.findIndex((member) => /founder|ceo/i.test(member?.role || ''));
  const founderMember = teamMembers[founderIndex >= 0 ? founderIndex : 0];
  const coreTeam = teamMembers.filter((_, idx) => idx !== (founderIndex >= 0 ? founderIndex : 0));

  const resolveImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
      return image;
    }
    if (image.startsWith('/')) {
      return `${apiBaseUrl}${image}`;
    }
    return image;
  };

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
                <h4 className="text-4xl font-bold mb-2 text-accent group-hover:scale-110 transition-transform">8+</h4>
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
            className="aspect-4/5 bg-linear-to-br from-accent/20 to-purple-600/20 rounded-3xl overflow-hidden relative group border border-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
              alt="Team working"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
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

        <motion.section {...fadeInUp} className="mb-12 relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/5 via-transparent to-transparent px-6 py-14 md:px-10">
          <div className="absolute -top-28 right-8 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-3">Our Team</h3>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              The people behind strategy, storytelling, and execution.
            </p>

            {founderMember && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-5xl mx-auto mb-12"
              >
                <div className="rounded-3xl overflow-hidden border border-accent/30 bg-black/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_60px_rgba(0,0,0,0.45)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative min-h-104 lg:min-h-120">
                      <img
                        src={resolveImageUrl(founderMember.image)}
                        alt={founderMember.name || 'Founder'}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                    </div>

                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Founder Spotlight</p>
                      <h4 className="text-3xl md:text-4xl font-black tracking-tight mb-3 uppercase">{founderMember.name}</h4>
                      <p className="text-accent text-sm md:text-base uppercase tracking-[0.2em] mb-6">{founderMember.role}</p>
                      <p className="text-gray-300 text-lg leading-relaxed">{founderMember.bio}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {coreTeam.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {coreTeam.map((member, idx) => (
                  <motion.article
                    key={`${member.name || 'member'}-${idx}`}
                    variants={itemVariants}
                    className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden group hover:border-accent/40 transition-all"
                  >
                    <div className="aspect-4/5 overflow-hidden bg-black/30">
                      <img
                        src={resolveImageUrl(member.image)}
                        alt={member.name || 'Team member'}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-bold mb-1 uppercase">{member.name}</h4>
                      <p className="text-accent text-sm uppercase tracking-[0.18em] mb-3">{member.role}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
