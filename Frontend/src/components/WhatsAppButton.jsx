import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { company } from '../utils/siteContent';

const WhatsAppButton = () => {
  return (
    <motion.a
      href={company.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open WhatsApp chat"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
};

export default WhatsAppButton;
