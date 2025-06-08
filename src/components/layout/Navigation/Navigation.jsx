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
      className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
        isActive 
          ? 'text-pink-600 font-semibold' 
          : 'text-gray-700 hover:text-pink-600'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.div
        layoutId="nav-underline"
        className="absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
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
 * Call to Action Button Component
 */
const CTAButton = () => {
  return (
    <Link
      to="/contact"
      className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
    >
      Get Started
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md p-6 text-left align-middle shadow-2xl transition-all border border-gray-200/50">
                {/* Close Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      onClick={onClose}
                      className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50/80 rounded-xl transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200/50">
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="block w-full px-4 py-3 text-center text-white font-semibold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-xl transition-all duration-200 shadow-md"
                  >
                    Get Started
                  </Link>
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
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-200/20 shadow-sm">
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

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center space-x-2">
                {navigationItems.map((item) => (
                  <AnimatedNavLink key={item.key} to={item.to}>
                    {item.label}
                  </AnimatedNavLink>
                ))}
              </div>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:flex items-center">
              <CTAButton />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={onMobileMenuToggle}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200"
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