/**
 * Animation Wrapper Component
 * Centralizes all animation logic following DRY principle
 * Provides consistent animations across the application
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_CONSTANTS } from '../../../core/constants/app.constants.js';

/**
 * Animation variants for different use cases
 */
const ANIMATION_VARIANTS = {
  page: ANIMATION_CONSTANTS.PAGE_TRANSITION,
  
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { type: 'spring', ...ANIMATION_CONSTANTS.SPRING }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { type: 'spring', ...ANIMATION_CONSTANTS.SPRING }
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { type: 'spring', ...ANIMATION_CONSTANTS.SPRING }
  },
  
  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { type: 'spring', ...ANIMATION_CONSTANTS.SPRING }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: 'spring', ...ANIMATION_CONSTANTS.SPRING }
  },
  
  stagger: {
    initial: 'hidden',
    animate: 'show',
    variants: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: ANIMATION_CONSTANTS.STAGGER.CHILDREN
        }
      }
    }
  },
  
  staggerList: {
    initial: 'hidden',
    animate: 'show',
    variants: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: ANIMATION_CONSTANTS.STAGGER.LIST_CHILDREN
        }
      }
    }
  },
  
  staggerItem: {
    variants: {
      hidden: { opacity: 0, y: 20 },
      show: { 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', ...ANIMATION_CONSTANTS.SPRING }
      }
    }
  }
};

/**
 * AnimationWrapper Component
 * @param {Object} props - Component props
 * @param {string} props.variant - Animation variant to use
 * @param {Object} props.customVariants - Custom animation variants
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.as - HTML element type (default: 'div')
 * @param {Object} props.className - CSS classes
 * @param {Object} props.style - Inline styles
 * @param {Object} props.motionProps - Additional motion props
 * @returns {JSX.Element}
 */
export const AnimationWrapper = ({
  variant = 'fadeIn',
  customVariants = null,
  children,
  as = 'div',
  className = '',
  style = {},
  motionProps = {},
  ...domProps
}) => {
  const MotionComponent = motion[as] || motion.div;
  const animationConfig = customVariants || ANIMATION_VARIANTS[variant] || ANIMATION_VARIANTS.fadeIn;

  // Merge animation config with custom motion props
  const finalAnimationConfig = {
    ...animationConfig,
    ...motionProps
  };

  return (
    <MotionComponent
      {...finalAnimationConfig}
      className={className}
      style={style}
      {...domProps}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * Page Transition Wrapper
 * Specialized wrapper for page transitions
 */
export const PageTransition = ({ children, className = '', ...props }) => (
  <AnimationWrapper
    variant="page"
    className={className}
    {...props}
  >
    {children}
  </AnimationWrapper>
);

/**
 * Stagger Animation Container
 * For animating lists and multiple items
 */
export const StaggerContainer = ({ 
  children, 
  variant = 'stagger',
  className = '',
  ...props 
}) => (
  <AnimationWrapper
    variant={variant}
    className={className}
    {...props}
  >
    {children}
  </AnimationWrapper>
);

/**
 * Stagger Animation Item
 * For individual items within stagger containers
 */
export const StaggerItem = ({ children, className = '', ...props }) => (
  <AnimationWrapper
    variant="staggerItem"
    className={className}
    {...props}
  >
    {children}
  </AnimationWrapper>
);

/**
 * Export animation variants for custom use
 */
export { ANIMATION_VARIANTS };

export default AnimationWrapper; 