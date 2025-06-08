/**
 * Footer Component
 * 
 * Displays application footer with social links and copyright information.
 * Follows SOLID principles with single responsibility for footer display.
 * 
 * Features:
 * - Responsive design with mobile optimization
 * - Social media integration with configuration-driven links
 * - Accessibility compliant with proper ARIA labels
 * - Error boundary resilience
 * - Performance optimized with proper link attributes
 * 
 * @version 2.0.0
 * @author TandavaLasya Development Team
 */

import React from 'react';
import { logger } from '../../../core/utils/logger.util.js';
import { SOCIAL_CONSTANTS } from '../../../core/constants/app.constants.js';

/**
 * Social Link Component
 * Reusable component for social media links following DRY principle
 * 
 * @param {Object} props - Component props
 * @param {string} props.href - Link URL
 * @param {string} props.label - Accessible label
 * @param {string} props.icon - FontAwesome icon class
 * @param {string} props.platform - Platform name for display
 * @returns {JSX.Element} Social media link
 */
function SocialLink({ href, label, icon, platform }) {
  const handleClick = () => {
    logger.info('Social media link clicked', {
      platform,
      url: href,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <a
      href={href}
      className="hover:text-pink-800 transition-colors duration-200 flex items-center gap-1"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      <i className={icon} aria-hidden="true"></i>
      <span className="hidden sm:inline">{platform}</span>
    </a>
  );
}

/**
 * Footer Component
 * Application footer with social links and copyright information
 * 
 * @returns {JSX.Element} Application footer
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  // Social media configuration - centralized and easily maintainable
  const socialLinks = [
    {
      platform: 'Instagram',
      href: `https://instagram.com/${SOCIAL_CONSTANTS.INSTAGRAM}`,
      icon: 'fab fa-instagram',
      label: 'Visit our Instagram page'
    },
    {
      platform: 'YouTube',
      href: `https://youtube.com/${SOCIAL_CONSTANTS.YOUTUBE}`,
      icon: 'fab fa-youtube',
      label: 'Visit our YouTube channel'
    }
  ];

  return (
    <footer 
      className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-pink-200 via-orange-100 to-blue-100 text-gray-700 py-4 px-4 border-t border-pink-200 z-50"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright Section */}
        <div className="font-bold text-lg tracking-wide">
          <span className="sr-only">Copyright</span>
          TandavaLasya &copy; {currentYear}
        </div>
        
        {/* Social Media Links */}
        <nav 
          className="flex gap-4 text-pink-600 text-xl"
          aria-label="Social media links"
        >
          {socialLinks.map(({ platform, href, icon, label }) => (
            <SocialLink
              key={platform}
              href={href}
              label={label}
              icon={icon}
              platform={platform}
            />
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer; 