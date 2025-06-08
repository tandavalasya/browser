/**
 * Navigation Component
 * Handles all navigation-related functionality following Single Responsibility Principle
 * - Responsive navigation menu
 * - Mobile menu handling
 * - Navigation animations
 */

import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { ANIMATION_CONSTANTS } from '../../../core/constants/app.constants.js';
import socials from '../../../config/socials.json';

/**
 * Animated Navigation Link Component
 * Provides consistent navigation link styling and animations
 */
const AnimatedNavLink = ({ to, children, onClick = null }) => {
  const [hovered, setHovered] = React.useState(false);
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-1 transition-colors ${
        isActive 
          ? 'text-pink-600 font-medium' 
          : 'text-gray-700 hover:text-pink-600'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.div
        layoutId="nav-underline"
        className="absolute left-0 -bottom-1 h-0.5 bg-pink-500 rounded"
        initial={false}
        animate={{ 
          width: (hovered || isActive) ? '100%' : '0%' 
        }}
        transition={{ duration: ANIMATION_CONSTANTS.UNDERLINE.duration }}
      />
    </Link>
  );
};

/**
 * Mobile Menu Component
 * Handles mobile navigation menu
 */
const MobileMenu = ({ isOpen, onClose, navigationItems }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        {/* Menu Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-end p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-x-full"
              enterTo="opacity-100 scale-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-x-0"
              leaveTo="opacity-0 scale-95 translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={onClose}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      onClick={onClose}
                      className="block px-3 py-2 text-lg font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex space-x-4 justify-center">
                    {socials.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500 transition-colors"
                        aria-label={social.name}
                      >
                        <span className="text-xl">{social.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

/**
 * Main Navigation Component
 */
const Navigation = ({
  navigationItems = [],
  mobileMenuOpen = false,
  onMobileMenuToggle = () => {},
  onMobileMenuClose = () => {}
}) => {
  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="relative z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
              >
                TandavaLasya
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigationItems.map((item) => (
                  <AnimatedNavLink key={item.key} to={item.to}>
                    {item.label}
                  </AnimatedNavLink>
                ))}
              </div>
            </div>

            {/* Social Links - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={onMobileMenuToggle}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={onMobileMenuClose}
        navigationItems={navigationItems}
      />
    </>
  );
};

export default Navigation; 