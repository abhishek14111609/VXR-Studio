import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, MapPin, Sparkles, CheckCircle2, TrendingUp, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company, featuredServices } from '../utils/siteContent';
import BrandMark from '../components/BrandMark';
import Counter from '../components/Counter';
import { fadeInUp, fadeInLeft, fadeInRight, stagger, containerVariants, itemVariants } from '../utils/animations';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
        {/* Cinematic Video Background - Using a placeholder high-end stock video */}
        <div className="absolute inset-0 z-0 bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
            className="w-full h-full object-cover opacity-40 scale-105"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-creative-agency-office-working-space-40348-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/95" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            {/* <div className="flex justify-center mb-8">
              <BrandMark compact />
            </div> */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-accent uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-6"
            >
              Social Media, Meta Ads, Design & Branding
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 leading-none"
            >
              CONTENT THAT <span className="text-gradient">CONVERTS</span>, CAMPAIGNS THAT MOVE.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
            >
              {company.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
            >
              <Link to="/services" className="group px-10 py-5 bg-gradient-to-r from-accent to-blue-600 text-white font-bold rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-accent/50 transition-all transform hover:scale-105">
                VIEW SERVICES <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-10 py-5 glass text-white font-bold rounded-full border border-white/40 hover:border-white/80 hover:bg-white/10 transition-all">
                GET A QUOTE
              </Link>
            </motion.div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-accent/40 border border-white/10 transition-all hover:bg-accent/5"
              >
                <Phone size={22} className="text-accent shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Call</p>
                  <a href={`tel:${company.phoneLink}`} className="font-semibold text-white hover:text-accent transition-colors">{company.phoneDisplay}</a>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-accent/40 border border-white/10 transition-all hover:bg-accent/5"
              >
                <Mail size={22} className="text-accent shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Email</p>
                  <a href={`mailto:${company.email}`} className="font-semibold text-white hover:text-accent transition-colors">{company.email}</a>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-accent/40 border border-white/10 transition-all hover:bg-accent/5"
              >
                <MapPin size={22} className="text-accent shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Location</p>
                  <p className="font-semibold text-white">Rajkot, Gujarat</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50"
        >
          <div className="w-px h-12 bg-white" />
        </motion.div>
      </section>

      {/* Services Overview */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-10 w-96 h-96 bg-accent rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <motion.div
            {...fadeInUp}
            className="mb-20 text-center"
          >
            <p className="text-accent uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-4">Featured Services</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">WHAT WE DO BEST</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-accent to-purple-600 mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {featuredServices.map((service, i) => (
              <motion.div
                variants={itemVariants}
                key={i}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
                className="p-10 glass rounded-3xl group hover:border-accent/50 transition-all cursor-default border border-white/10 backdrop-blur-md"
              >
                <div className="inline-flex items-center gap-2 text-accent uppercase tracking-[0.35em] text-xs font-bold mb-6">
                  <Sparkles size={16} /> Featured service
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-200 transition-colors mb-6">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(service.highlights || []).map((highlight, idx) => {
                    const highlightText = typeof highlight === 'string' ? highlight : highlight?.text;
                    if (!highlightText) return null;

                    return (
                      <span key={`${highlightText}-${idx}`} className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10">
                        {highlightText}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats/Showcase section */}
      <section className="py-24 bg-gradient-to-b from-accent/5 to-accent/10 relative overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            {...fadeInUp}
            className="mb-16"
          >
            <h3 className="text-2xl md:text-4xl font-bold">Why Brands Trust VXR</h3>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -30px 0px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            <motion.div variants={itemVariants} className="group">
              <div className="mb-4 inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 group-hover:from-accent/30 group-hover:to-accent/10 transition-all">
                <TrendingUp size={28} className="text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2"><Counter end={8} /></h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm">Core Services</p>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div className="mb-4 inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 group-hover:from-purple-500/30 group-hover:to-purple-500/10 transition-all">
                <Zap size={28} className="text-purple-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">Meta+</h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm">Ads & Content</p>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div className="mb-4 inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 group-hover:from-green-500/30 group-hover:to-green-500/10 transition-all">
                <CheckCircle2 size={28} className="text-green-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-2">100%</h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm">Success Focused</p>
            </motion.div>
            <motion.div variants={itemVariants} className="group">
              <div className="mb-4 inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 group-hover:from-orange-500/30 group-hover:to-orange-500/10 transition-all">
                <Users size={28} className="text-orange-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">24h</h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm">Response Time</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <motion.div
            {...fadeInUp}
            className="text-center mb-20"
          >
            <p className="text-accent uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-4">How We Work</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Process For Success</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">We follow a proven methodology combining strategy, creativity, and data to deliver results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Discovery & Strategy',
                desc: 'We analyze your brand, audience, goals, and market to craft a tailored growth strategy.',
              },
              {
                number: '02',
                title: 'Creation & Launch',
                desc: 'Our team builds content, ads, and campaigns optimized for performance and engagement.',
              },
              {
                number: '03',
                title: 'Optimize & Scale',
                desc: 'We monitor, analyze, and refine your campaigns for consistent measurable growth.',
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.15 }}
                className="relative p-10 rounded-3xl glass border border-white/10 overflow-hidden group hover:border-accent/40 transition-all"
              >
                <div className="absolute -top-10 -right-10 text-6xl font-black opacity-5 group-hover:opacity-10 transition-opacity">
                  {step.number}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-accent mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
