/**
 * Email Service
 * 
 * Handles email functionality with EmailJS integration.
 * Follows SOLID principles and provides comprehensive error handling.
 * 
 * Features:
 * - Contact form email sending
 * - Retry logic with exponential backoff
 * - Configuration-driven setup
 * - Comprehensive logging
 * - Domain validation
 * - Rate limiting protection
 * 
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import emailjs from 'emailjs-com';
import { BaseService } from './base.service.js';
import { logger } from '../utils/logger.util.js';
import { errorHandler, NetworkError, ValidationError } from '../utils/error-handler.util.js';

/**
 * Email Configuration Manager
 * Handles EmailJS configuration with fallbacks for testing
 */
class EmailConfigManager {
  constructor() {
    this.config = this.loadConfiguration();
    this.initializeEmailJS();
  }

  loadConfiguration() {
    try {
      // Try to load production configuration from static import
      const config = {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'test-key',
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'test-service',
        userTemplateId: import.meta.env.VITE_EMAILJS_USER_TEMPLATE || 'test-user-template',
        adminTemplateId: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE || 'test-admin-template',
        allowedDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com', 'localhost'],
        rateLimit: {
          maxRequests: 5,
          windowMs: 60000 // 1 minute
        }
      };

      if (config.publicKey !== 'test-key') {
        logger.info('EmailJS configuration loaded from environment variables');
      } else {
        logger.info('EmailJS running in development mode - contact form will simulate email sending', {
          note: 'To enable email sending, configure environment variables as described in docs/ENVIRONMENT_SETUP.md'
        });
      }
      
      return config;
    } catch (error) {
      // Fallback configuration for development/testing
      logger.warn('EmailJS configuration error, using fallback configuration', {
        error: error.message
      });
      
      return {
        publicKey: 'test-key',
        serviceId: 'test-service',
        userTemplateId: 'test-user-template',
        adminTemplateId: 'test-admin-template',
        allowedDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com', 'localhost'],
        rateLimit: {
          maxRequests: 5,
          windowMs: 60000 // 1 minute
        }
      };
    }
  }

  initializeEmailJS() {
    if (this.config.publicKey && this.config.publicKey !== 'test-key') {
      try {
        emailjs.init(this.config.publicKey);
        logger.info('EmailJS initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize EmailJS', { error: error.message });
        throw new Error('Email service initialization failed');
      }
    } else {
      logger.info('EmailJS running in development mode - contact form will simulate email sending');
    }
  }

  getConfig() {
    return this.config;
  }
}

/**
 * Email Validator
 * Handles email validation logic
 */
class EmailValidator {
  constructor(allowedDomains) {
    this.allowedDomains = allowedDomains || [];
  }

  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    return true;
  }

  validateDomain(email) {
    const domain = email.split('@')[1];
    
    // Allow localhost for development
    if (window.location.hostname === 'localhost' && domain === 'localhost') {
      return true;
    }

    // Check against allowed domains
    const isAllowed = this.allowedDomains.some(allowedDomain => 
      domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
    );

    if (!isAllowed) {
      logger.warn('Email domain not allowed', { domain, allowedDomains: this.allowedDomains });
      throw new ValidationError(`Email domain '${domain}' is not allowed`);
    }

    return true;
  }

  validateContactForm(formData) {
    const { name, email, message, location } = formData;

    if (!name || name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }

    this.validateEmail(email);
    this.validateDomain(email);

    if (!message || message.trim().length < 10) {
      throw new ValidationError('Message must be at least 10 characters long');
    }

    if (!location || location.trim().length === 0) {
      throw new ValidationError('Location is required');
    }

    return true;
  }
}

/**
 * Rate Limiter
 * Prevents email spam and abuse
 */
class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => now - timestamp < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      logger.warn('Rate limit exceeded', { 
        identifier, 
        requests: validRequests.length, 
        maxRequests: this.maxRequests 
      });
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(timestamp => now - timestamp < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Email Service
 * Main service class for handling email operations
 */
export class EmailService extends BaseService {
  constructor() {
    super('EmailService');
    
    this.configManager = new EmailConfigManager();
    this.config = this.configManager.getConfig();
    this.validator = new EmailValidator(this.config.allowedDomains);
    this.rateLimiter = new RateLimiter(
      this.config.rateLimit?.maxRequests || 5,
      this.config.rateLimit?.windowMs || 60000
    );
  }

  /**
   * Send contact form email
   * 
   * @param {Object} formData - Contact form data
   * @param {string} formData.name - Sender name
   * @param {string} formData.email - Sender email
   * @param {string} formData.message - Message content
   * @param {string} formData.location - Preferred location
   * @param {string} formData.submittedAt - Submission timestamp
   * @returns {Promise<Object>} Email send result
   */
  async sendContactForm(formData) {
    const startTime = Date.now();
    
    try {
      logger.info('Contact form email send started', {
        timestamp: new Date().toISOString(),
        senderEmail: formData.email
      });

      // Validate form data
      this.validator.validateContactForm(formData);

      // Check rate limiting
      const identifier = formData.email;
      if (!this.rateLimiter.isAllowed(identifier)) {
        throw new ValidationError(
          `Too many requests. Please wait before sending another message. ` +
          `Remaining requests: ${this.rateLimiter.getRemainingRequests(identifier)}`
        );
      }

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        location: formData.location,
        submitted_at: formData.submittedAt || new Date().toISOString(),
        user_agent: formData.userAgent || 'Unknown',
        referrer: formData.referrer || 'Direct'
      };

      // Send emails with retry logic
      const results = await this.sendEmailsWithRetry(templateParams);

      const duration = Date.now() - startTime;
      logger.info('Contact form email sent successfully', {
        duration,
        userEmailSent: results.userEmail.success,
        adminEmailSent: results.adminEmail.success,
        senderEmail: formData.email
      });

      return {
        success: true,
        results,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      const handledError = errorHandler.handle(error, 'Email Service');
      
      logger.error('Contact form email send failed', {
        error: handledError.message,
        duration,
        senderEmail: formData.email
      });

      throw handledError;
    }
  }

  /**
   * Send emails with retry logic
   * 
   * @param {Object} templateParams - Email template parameters
   * @returns {Promise<Object>} Send results
   */
  async sendEmailsWithRetry(templateParams) {
    const maxRetries = 3;
    const results = {
      userEmail: { success: false, error: null },
      adminEmail: { success: false, error: null }
    };

    // Send user acknowledgment email
    try {
      await errorHandler.handleWithRetry(async () => {
        if (this.config.publicKey === 'test-key') {
          // Simulate email send in test mode
          logger.info('Simulating user email send (test mode)');
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          await emailjs.send(
            this.config.serviceId,
            this.config.userTemplateId,
            templateParams
          );
        }
      }, maxRetries, 1000, 'User acknowledgment email');
      
      results.userEmail.success = true;
      logger.debug('User acknowledgment email sent successfully');
      
    } catch (error) {
      results.userEmail.error = error.message;
      logger.warn('Failed to send user acknowledgment email', { error: error.message });
    }

    // Send admin notification email
    try {
      await errorHandler.handleWithRetry(async () => {
        if (this.config.publicKey === 'test-key') {
          // Simulate email send in test mode
          logger.info('Simulating admin email send (test mode)');
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          await emailjs.send(
            this.config.serviceId,
            this.config.adminTemplateId,
            templateParams
          );
        }
      }, maxRetries, 1000, 'Admin notification email');
      
      results.adminEmail.success = true;
      logger.debug('Admin notification email sent successfully');
      
    } catch (error) {
      results.adminEmail.error = error.message;
      logger.warn('Failed to send admin notification email', { error: error.message });
    }

    // At least one email should succeed
    if (!results.userEmail.success && !results.adminEmail.success) {
      throw new NetworkError('Failed to send any emails after retries');
    }

    return results;
  }

  /**
   * Get service status and configuration
   * 
   * @returns {Object} Service status
   */
  getStatus() {
    return {
      serviceName: this.serviceName,
      isConfigured: this.config.publicKey !== 'test-key',
      allowedDomains: this.config.allowedDomains,
      rateLimit: this.config.rateLimit,
      testMode: this.config.publicKey === 'test-key'
    };
  }

  /**
   * Check if email domain is allowed
   * 
   * @param {string} email - Email to check
   * @returns {boolean} Whether domain is allowed
   */
  isDomainAllowed(email) {
    try {
      this.validator.validateDomain(email);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get remaining requests for rate limiting
   * 
   * @param {string} identifier - User identifier (email)
   * @returns {number} Remaining requests
   */
  getRemainingRequests(identifier) {
    return this.rateLimiter.getRemainingRequests(identifier);
  }
} 