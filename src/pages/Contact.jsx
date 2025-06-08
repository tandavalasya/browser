import React, { Fragment, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import config from '../config/tandavalasya.config.json';
import emailjsConfig from '../config/emailjs.json';

// Initialize EmailJS with the public key
emailjs.init(emailjsConfig.publicKey);

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
  const [domainError, setDomainError] = useState('');

  // Pre-fill message if present
  useEffect(() => {
    if (prefillMessage) {
      setForm((f) => ({ ...f, message: prefillMessage }));
    }
  }, [prefillMessage]);

  const validateDomain = (email) => {
    const domain = email.split('@')[1];
    return emailjsConfig.allowedDomains.some(allowedDomain => 
      domain === allowedDomain || 
      (allowedDomain === 'localhost' && window.location.hostname === 'localhost')
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear domain error when email changes
    if (name === 'email' && domainError) {
      setDomainError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setDomainError('');

    // Validate domain
    if (!validateDomain(form.email)) {
      setDomainError('Please use an email from an allowed domain');
      setLoading(false);
      return;
    }

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
      location: form.location,
      submitted_at: new Date().toLocaleString()
    };

    try {
      // Send acknowledgment to user
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.userTemplateId, // Template for user acknowledgment
        templateParams
      );

      // Send notification to admin (BCC)
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.adminTemplateId, // Template for admin notification
        templateParams
      );

      setStatus('success');
      setForm({ name: '', email: '', message: '', location: '' });
    } catch (err) {
      console.error('Error sending email:', err);
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
        className="text-3xl font-bold mb-8 text-center text-blue-700 max-w-xl mx-auto"
        variants={itemVariants}
      >
        Contact
      </motion.h2>
      <motion.form
        onSubmit={handleSubmit}
        className="rounded-xl p-8 flex flex-col gap-4"
        variants={itemVariants}
      >
        <motion.input 
          name="name" 
          type="text" 
          placeholder="Your Name" 
          value={form.name} 
          onChange={handleChange} 
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400" 
          required 
          variants={itemVariants} 
        />
        <div className="flex flex-col gap-1">
          <motion.input 
            name="email" 
            type="email" 
            placeholder="Your Email" 
            value={form.email} 
            onChange={handleChange} 
            className={`px-4 py-2 rounded border ${domainError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-400`}
            required 
            variants={itemVariants} 
          />
          {domainError && (
            <motion.span 
              className="text-red-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {domainError}
            </motion.span>
          )}
        </div>
        <motion.textarea 
          name="message" 
          placeholder="Your Message" 
          rows={4} 
          value={form.message} 
          onChange={handleChange} 
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400" 
          required 
          variants={itemVariants} 
        />
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">Location <span className="text-pink-500">*</span></label>
          <select 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            required 
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select...</option>
            {config.locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <motion.button
          type="submit"
          className="px-6 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !!domainError}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </motion.button>
        {status === 'success' && (
          <motion.div 
            className="text-green-600 mt-2" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            Message sent successfully!
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div 
            className="text-red-600 mt-2" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            Failed to send message. Please try again.
          </motion.div>
        )}
      </motion.form>
      <motion.div className="mt-8 flex flex-col items-center gap-2" variants={itemVariants}>
        <span className="text-gray-600">Or reach out on:</span>
        <div className="flex gap-4 mt-2">
          <a href={`https://instagram.com/${config.socials.instagram}`} className="text-pink-600 hover:text-pink-800 font-bold" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={`https://youtube.com/${config.socials.youtube}`} className="text-red-600 hover:text-red-800 font-bold" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
      </motion.div>
      <motion.div className="mt-8 bg-blue-100 rounded-lg h-40 flex items-center justify-center text-blue-400" variants={itemVariants}>[Map Placeholder]</motion.div>
    </motion.section>
  );
};

export default Contact; 