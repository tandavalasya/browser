import React, { Fragment, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import config from '../config/tandavalasya.config.json';

const SERVICE_ID = 'your_service_id'; // TODO: Replace with your EmailJS service ID
const TEMPLATE_ID = 'your_template_id'; // TODO: Replace with your EmailJS template ID
const USER_ID = 'your_user_id'; // TODO: Replace with your EmailJS user ID

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60 } },
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Contact = () => {
  const query = useQuery();
  const prefillMessage = query.get('message') || '';
  const [form, setForm] = useState({ name: '', email: '', message: '', location: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill message if present
  useEffect(() => {
    if (prefillMessage) {
      setForm((f) => ({ ...f, message: prefillMessage }));
    }
  }, [prefillMessage]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          location: form.location,
        },
        USER_ID
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '', location: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="max-w-xl mx-auto py-12 px-4"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-blue-700"
        variants={itemVariants}
      >
        Contact
      </motion.h2>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-4"
        variants={itemVariants}
      >
        <motion.input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400" required variants={itemVariants} />
        <motion.input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400" required variants={itemVariants} />
        <motion.textarea name="message" placeholder="Your Message" rows={4} value={form.message} onChange={handleChange} className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400" required variants={itemVariants} />
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Location <span className="text-pink-500">*</span></label>
          <select name="location" value={form.location} onChange={handleChange} required className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400">
            <option value="">Select...</option>
            {config.locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <motion.button
          type="submit"
          className="px-6 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </motion.button>
        {status === 'success' && <motion.div className="text-green-600 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Message sent successfully!</motion.div>}
        {status === 'error' && <motion.div className="text-red-600 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Failed to send message. Please try again.</motion.div>}
      </motion.form>
      <motion.div className="mt-8 flex flex-col items-center gap-2" variants={itemVariants}>
        <span className="text-gray-600">Or reach out on:</span>
        <div className="flex gap-4 mt-2">
          <a href={`https://instagram.com/${config.socials.instagram}`} className="text-pink-600 hover:text-pink-800 font-bold" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-bold">Facebook</a>
          <a href={`https://youtube.com/${config.socials.youtube}`} className="text-red-600 hover:text-red-800 font-bold" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
      </motion.div>
      <motion.div className="mt-8 bg-blue-100 rounded-lg h-40 flex items-center justify-center text-blue-400" variants={itemVariants}>[Map Placeholder]</motion.div>
    </motion.section>
  );
};

export default Contact; 