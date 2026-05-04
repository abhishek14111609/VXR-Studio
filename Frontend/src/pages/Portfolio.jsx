import { motion, AnimatePresence } from 'framer-motion';
import { X, CirclePlay } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSEO, useStructuredData } from '../hooks/useSEO';

const categories = ['All', 'Reels', 'Ads', 'Photography', 'Branding'];
const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEO Meta Tags
  useSEO({
    title: 'Portfolio | Our Cinematic Content & Campaigns | VXR Media House',
    description: 'Explore our portfolio showcasing high-impact reels, ads, photography, and branding projects for premium brands in Rajkot. Cinematic content creation & digital campaigns.',
    keywords: 'portfolio, case studies, video reels, advertising campaigns, branding projects, content portfolio, social media content, Rajkot creative agency',
    image: 'https://vxrmedia.in/og-image.jpg',
    url: 'https://vxrmedia.in/portfolio',
    type: 'website',
  });

  // Portfolio page structured data
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Portfolio - VXR Media House",
    "description": "Showcase of our cinematic content creation and digital campaigns",
    "url": "https://vxrmedia.in/portfolio"
  });

  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/portfolio`);
      setPortfolioItems(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-accent">Loading portfolio...</div>
      </div>
    );
  }

  const filteredItems = activeCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">OUR WORK</h1>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all border ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -50px 0px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredItems.map((item) => (
          <motion.div
            layout
            key={item.id}
            variants={itemVariants}
            className="group relative aspect-video bg-gray-900 rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
              <p className="text-accent text-sm font-bold tracking-widest mb-2">{item.category.toUpperCase()}</p>
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              {item.type === 'video' && <CirclePlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" size={60} />}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-5xl w-full bg-primary rounded-3xl overflow-hidden border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                <X size={32} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-video md:aspect-auto">
                  <img src={selectedItem.url} alt={selectedItem.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <p className="text-accent font-bold tracking-widest mb-2">{selectedItem.category.toUpperCase()}</p>
                  <h2 className="text-4xl font-bold mb-6">{selectedItem.title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {selectedItem.description}
                  </p>
                  <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-accent hover:text-white transition-all">
                    VIEW FULL PROJECT
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
