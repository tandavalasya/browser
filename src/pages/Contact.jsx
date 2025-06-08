/**
 * Contact Page Component
 * 
 * Provides contact form functionality with email integration.
 * Refactored to follow SOLID principles and modern React patterns.
 * 
 * Architecture:
 * - Single Responsibility: Each component has one clear purpose
 * - Open/Closed: Extensible through configuration and composition
 * - Dependency Inversion: Uses service injection and configuration
 * - Error Boundaries: Comprehensive error handling with graceful degradation
 * - Validation: Client-side and server-side validation with proper feedback
 * 
 * Features:
 * - Contact form with validation
 * - Email service integration with retry logic
 * - Social media links
 * - Location selection
 * - Comprehensive logging and error handling
 * - Accessibility compliance
 * 
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Core utilities and services
import { logger } from '../core/utils/logger.util.js';
import { errorHandler } from '../core/utils/error-handler.util.js';
import { EmailService } from '../core/services/email.service.js';

// UI Components
import ErrorBoundary from '../components/ui/ErrorBoundary/ErrorBoundary.jsx';
import { 
  AnimationWrapper, 
  StaggerContainer, 
  StaggerItem 
} from '../components/ui/Animation/AnimationWrapper.jsx';

// Configuration and constants
import { 
  ERROR_CONSTANTS, 
  SUCCESS_CONSTANTS,
  SOCIAL_CONSTANTS 
} from '../core/constants/app.constants.js';

// Local data
import locationsData from '../config/locations.json';

/**
 * Custom hook for URL query parameters
 * 
 * @returns {URLSearchParams} URL search parameters
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * Form validation utility
 * Centralizes all validation logic following DRY principle
 */
class ContactFormValidator {
  static validateName(name) {
    if (!name || name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.length > 100) {
      return 'Name must be less than 100 characters';
    }
    return null;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (email.length > 254) {
      return 'Email address is too long';
    }
    return null;
  }

  static validateMessage(message) {
    if (!message || message.trim().length < 10) {
      return 'Message must be at least 10 characters long';
    }
    if (message.length > 2000) {
      return 'Message must be less than 2000 characters';
    }
    return null;
  }

  static validateLocation(location) {
    if (!location) {
      return 'Please select a location';
    }
    if (!locationsData.includes(location)) {
      return 'Please select a valid location';
    }
    return null;
  }

  static validateForm(formData) {
    const errors = {};
    
    const nameError = this.validateName(formData.name);
    if (nameError) errors.name = nameError;

    const emailError = this.validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const messageError = this.validateMessage(formData.message);
    if (messageError) errors.message = messageError;

    const locationError = this.validateLocation(formData.location);
    if (locationError) errors.location = locationError;

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

/**
 * Contact Form Component
 * Handles form state, validation, and submission
 * 
 * @param {Object} props - Component props
 * @param {string} props.prefillMessage - Pre-filled message from URL params
 * @returns {JSX.Element} Contact form
 */
function ContactForm({ prefillMessage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: prefillMessage || '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [emailService] = useState(() => {
    try {
      return new EmailService();
    } catch (error) {
      logger.error('EmailService initialization failed', { error: error.message });
      return null;
    }
  });

  // Pre-fill message if present
  useEffect(() => {
    if (prefillMessage && prefillMessage !== formData.message) {
      setFormData(prev => ({ ...prev, message: prefillMessage }));
      logger.info('Contact form pre-filled with message', { 
        messageLength: prefillMessage.length 
      });
    }
  }, [prefillMessage, formData.message]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Clear submit status when form is modified
    if (submitStatus) {
      setSubmitStatus(null);
    }

    logger.debug('Contact form field updated', { field: name, valueLength: value.length });
  }, [errors, submitStatus]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    logger.info('Contact form submission started', {
      timestamp: new Date().toISOString(),
      formFields: Object.keys(formData)
    });

    // Validate form
    const validation = ContactFormValidator.validateForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      logger.warn('Contact form validation failed', { errors: validation.errors });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus(null);

    try {
      // Prepare email data
      const emailData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct'
      };

      // Send email using service
      if (!emailService) {
        throw new Error('Email service not available');
      }
      await emailService.sendContactForm(emailData);

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '', location: '' });
      
      logger.info('Contact form submitted successfully', {
        location: formData.location,
        messageLength: formData.message.length
      });

    } catch (error) {
      const handledError = errorHandler.handle(error, 'Contact Form Submission');
      setSubmitStatus('error');
      
      logger.error('Contact form submission failed', {
        error: handledError.message,
        formData: { ...formData, message: '[REDACTED]' } // Don't log sensitive message content
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, emailService]);

  const isFormValid = useMemo(() => {
    return ContactFormValidator.validateForm(formData).isValid;
  }, [formData]);

  return (
    <StaggerContainer>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate role="form">
        {/* Name Field */}
        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.1 } }}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter your full name"
              required
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm" role="alert">
                {errors.name}
              </p>
            )}
          </div>
        </AnimationWrapper>

        {/* Email Field */}
        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.2 } }}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter your email address"
              required
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </AnimationWrapper>

        {/* Location Field */}
        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.3 } }}>
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              Preferred Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                errors.location 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
              } focus:outline-none focus:ring-2`}
              required
              aria-describedby={errors.location ? 'location-error' : undefined}
              aria-invalid={!!errors.location}
            >
              <option value="">Select a location...</option>
              {locationsData.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {errors.location && (
              <p id="location-error" className="text-red-500 text-sm" role="alert">
                {errors.location}
              </p>
            )}
          </div>
        </AnimationWrapper>

        {/* Message Field */}
        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.4 } }}>
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 resize-vertical ${
                errors.message 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-pink-500 focus:ring-pink-200'
              } focus:outline-none focus:ring-2`}
              placeholder="Tell us about your interest in Bharatanatyam, your experience level, or any questions you have..."
              required
              aria-describedby={errors.message ? 'message-error' : 'message-help'}
              aria-invalid={!!errors.message}
            />
            {errors.message ? (
              <p id="message-error" className="text-red-500 text-sm" role="alert">
                {errors.message}
              </p>
            ) : (
              <p id="message-help" className="text-gray-500 text-sm">
                {formData.message.length}/2000 characters
              </p>
            )}
          </div>
        </AnimationWrapper>

        {/* Submit Button */}
        <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.5 } }}>
          <motion.button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
              isSubmitting || !isFormValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 hover:shadow-lg'
            }`}
            whileHover={!isSubmitting && isFormValid ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting && isFormValid ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Message...
              </span>
            ) : (
              'Send Message'
            )}
          </motion.button>
        </AnimationWrapper>

        {/* Status Messages */}
        {submitStatus && (
          <AnimationWrapper variant="fadeIn">
            <div className={`p-4 rounded-lg ${
              submitStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`} role="alert">
              {submitStatus === 'success' ? (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {SUCCESS_CONSTANTS.EMAIL_SENT}
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {ERROR_CONSTANTS.EMAIL_SEND}
                </div>
              )}
            </div>
          </AnimationWrapper>
        )}
      </form>
    </StaggerContainer>
  );
}

/**
 * Social Links Component
 * Displays social media contact options
 * 
 * @returns {JSX.Element} Social links section
 */
function SocialLinksSection() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: `https://instagram.com/${SOCIAL_CONSTANTS.INSTAGRAM}`,
      icon: '📷',
      color: 'text-pink-600 hover:text-pink-800'
    },
    {
      name: 'YouTube',
      url: `https://youtube.com/${SOCIAL_CONSTANTS.YOUTUBE}`,
      icon: '📺',
      color: 'text-red-600 hover:text-red-800'
    }
  ];

  const handleSocialClick = useCallback((platform, url) => {
    logger.info('Social media link clicked from contact page', {
      platform,
      url,
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.6 } }}>
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Or connect with us on social media
        </h3>
        <div className="flex justify-center gap-6">
          {socialLinks.map(({ name, url, icon, color }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 font-semibold transition-colors duration-200 ${color}`}
              onClick={() => handleSocialClick(name, url)}
            >
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              {name}
            </a>
          ))}
        </div>
      </div>
    </AnimationWrapper>
  );
}

/**
 * Location Map Placeholder Component
 * Placeholder for future map integration
 * 
 * @returns {JSX.Element} Map placeholder
 */
function LocationMapPlaceholder() {
  return (
    <AnimationWrapper variant="fadeIn" motionProps={{ transition: { delay: 0.7 } }}>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center border-2 border-dashed border-blue-200">
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Find Us
        </h3>
        <p className="text-gray-600">
          Interactive map coming soon to help you locate our studios
        </p>
      </div>
    </AnimationWrapper>
  );
}

/**
 * Main Contact Page Component
 * Orchestrates all contact page sections with proper error boundaries
 * 
 * @returns {JSX.Element} Complete contact page
 */
function Contact() {
  const query = useQuery();
  const prefillMessage = query.get('message') || '';

  useEffect(() => {
    logger.info('Contact page mounted', {
      timestamp: new Date().toISOString(),
      hasPrefillMessage: !!prefillMessage,
      userAgent: navigator.userAgent
    });

    return () => {
      logger.debug('Contact page unmounted');
    };
  }, [prefillMessage]);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Page Header */}
        <AnimationWrapper variant="fadeIn">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Ready to begin your Bharatanatyam journey? We'd love to hear from you!
            </p>
          </div>
        </AnimationWrapper>

        {/* Contact Form */}
        <ErrorBoundary
          context="Contact Form"
          fallback={(error) => {
            logger.error('Contact form error', { error });
            return (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <h2 className="text-xl font-bold text-red-800 mb-4">
                  Contact Form Unavailable
                </h2>
                <p className="text-red-600 mb-4">
                  We're experiencing technical difficulties with our contact form.
                </p>
                <p className="text-gray-700">
                  Please reach out to us directly via social media or try again later.
                </p>
              </div>
            );
          }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <ContactForm prefillMessage={prefillMessage} />
          </div>
        </ErrorBoundary>

        {/* Social Links */}
        <ErrorBoundary
          context="Social Links"
          fallback={(error) => {
            logger.error('Social links error', { error });
            return null; // Graceful degradation
          }}
        >
          <SocialLinksSection />
        </ErrorBoundary>

        {/* Location Map Placeholder */}
        <ErrorBoundary
          context="Location Map"
          fallback={(error) => {
            logger.error('Location map error', { error });
            return null; // Graceful degradation
          }}
        >
          <LocationMapPlaceholder />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Contact; 