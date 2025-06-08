import { render, screen } from '@testing-library/react';
import BackgroundElements from '../components/layout/Background/BackgroundElements';
import '@testing-library/jest-dom';

// Mock framer-motion to prevent complex animation issues
jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => {
      return ({ children, ...props }) => {
        return <div {...props}>{children}</div>;
      };
    }
  }),
  AnimatePresence: ({ children }) => children,
}));

describe('BackgroundElements Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DancerBackground Mobile Responsiveness', () => {
    test('renders dancer background image on all screen sizes', () => {
      render(<BackgroundElements />);
      
      // DancerBackground should be visible (not hidden on mobile anymore)
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
      
      // Image should have responsive classes
      expect(dancerImage).toHaveClass('fixed', 'z-10');
      
      // Should NOT have 'hidden' class that was previously hiding it on mobile
      expect(dancerImage).not.toHaveClass('hidden');
    });

    test('dancer background has responsive positioning classes', () => {
      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
      
      // Should have responsive right positioning
      const classString = dancerImage.className;
      expect(classString).toMatch(/right-\[-15vw\]/); // Mobile
      expect(classString).toMatch(/sm:right-\[-12vw\]/); // Small screens
      expect(classString).toMatch(/md:right-\[-10vw\]/); // Medium screens
      expect(classString).toMatch(/lg:right-\[-8vw\]/); // Large screens
    });

    test('dancer background has appropriate opacity for mobile', () => {
      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
      
      // Should have different opacity for mobile vs desktop
      expect(dancerImage).toHaveClass('opacity-20'); // Mobile opacity
      expect(dancerImage).toHaveClass('md:opacity-25'); // Desktop opacity
    });

    test('dancer background maintains visual filters', () => {
      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
      
      // Should maintain visual styling
      expect(dancerImage).toHaveClass('grayscale', 'contrast-125', 'blur-[1px]');
      expect(dancerImage).toHaveClass('mix-blend-multiply');
    });

    test('dancer background does not interfere with user interactions', () => {
      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
      
      // Should be non-interactive
      expect(dancerImage).toHaveClass('pointer-events-none');
    });
  });

  describe('Thoranam Garland', () => {
    test('renders thoranam garland SVG', () => {
      render(<BackgroundElements />);
      
      const garlandSvg = document.querySelector('svg[viewBox="0 0 1300 200"]');
      expect(garlandSvg).toBeInTheDocument();
    });

    test('thoranam garland is properly positioned', () => {
      render(<BackgroundElements />);
      
      const garlandContainer = document.querySelector('.fixed.top-0.left-0.w-full.h-20');
      expect(garlandContainer).toBeInTheDocument();
    });

    test('thoranam garland has correct z-index', () => {
      render(<BackgroundElements />);
      
      const garlandContainer = document.querySelector('.fixed.top-0.left-0.w-full.h-20');
      expect(garlandContainer).toHaveClass('z-10');
    });
  });

  describe('Floating Elements', () => {
    test('floating elements render without errors', () => {
      render(<BackgroundElements />);
      
      // Component should render successfully
      expect(document.querySelector('img[alt="Bharatanatyam dancer pose"]')).toBeInTheDocument();
    });

    test('floating elements have proper z-index layering', () => {
      render(<BackgroundElements />);
      
      // Background elements should have appropriate z-index
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toHaveClass('z-10');
    });
  });

  describe('Component Integration', () => {
    test('all background elements render together', () => {
      render(<BackgroundElements />);
      
      // Dancer background
      expect(document.querySelector('img[alt="Bharatanatyam dancer pose"]')).toBeInTheDocument();
      
      // Thoranam garland
      expect(document.querySelector('svg[viewBox="0 0 1300 200"]')).toBeInTheDocument();
    });

    test('background elements do not cause layout shifts', () => {
      render(<BackgroundElements />);
      
      // All background elements should be fixed positioned
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toHaveClass('fixed');
    });
  });

  describe('Responsive Behavior Simulation', () => {
    test('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile width
      });

      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
      
      // Should be visible on mobile (no 'hidden' class)
      expect(dancerImage).not.toHaveClass('hidden');
    });

    test('adapts to tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768, // Tablet width
      });

      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
    });

    test('adapts to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024, // Desktop width
      });

      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility', () => {
    test('background elements have proper alt text', () => {
      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toHaveAttribute('alt', 'Bharatanatyam dancer pose');
    });

    test('background elements are non-interactive for accessibility', () => {
      render(<BackgroundElements />);
      
      const dancerImage = document.querySelector('img[alt="Bharatanatyam dancer pose"]');
      expect(dancerImage).toHaveClass('pointer-events-none');
    });

    test('component mounts and unmounts cleanly', () => {
      const { unmount } = render(<BackgroundElements />);
      
      // Should mount successfully
      expect(document.querySelector('img[alt="Bharatanatyam dancer pose"]')).toBeInTheDocument();
      
      // Should unmount without errors
      unmount();
    });
  });
}); 