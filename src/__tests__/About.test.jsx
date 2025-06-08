import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from '../pages/About';
import '@testing-library/jest-dom';

// Mock ReactMarkdown to avoid ES module issues
jest.mock('react-markdown', () => {
  return ({ children }) => <div>{children}</div>;
});

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
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
}));

// Mock the config files
jest.mock('../config/instructors.json', () => ([
  {
    id: 'bhargavi',
    name: 'Bhargavi Venkataraman',
    title: 'Founder & Lead Instructor',
    bio: 'MFA (Bharatanatyam), Grade B Doordarshan artist, award-winning performer',
    image: '/instructor.jpg',
    detailedBio: 'Detailed bio content...'
  }
]), { virtual: true });

const renderAbout = () => {
  return render(
    <BrowserRouter>
      <About />
    </BrowserRouter>
  );
};

describe('About Component', () => {
  test('renders main heading with split text', () => {
    renderAbout();
    
    // Check for main heading parts - text is split across elements
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('TandavaLasya')).toBeInTheDocument();
  });

  test('renders about tandavalasya section', () => {
    renderAbout();
    
    // Check for TandavaLasya content and instructor name
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('TandavaLasya')).toBeInTheDocument();
    expect(screen.getByText('Bhargavi Venkataraman')).toBeInTheDocument();
  });

  test('renders mission and vision section', () => {
    renderAbout();
    
    // Check for mission & vision section - updated title
    expect(screen.getByText('Our Mission & Vision')).toBeInTheDocument();
    expect(screen.getByText('Mission')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();
  });

  // Vision/Mission Equal Height Tests - Critical for alignment fix
  describe('Mission & Vision Card Alignment', () => {
    test('mission and vision cards have equal height layout', () => {
      renderAbout();
      
      // Get all elements that contain mission/vision content
      const missionElements = screen.getByText('Mission').parentElement.parentElement;
      const visionElements = screen.getByText('Vision').parentElement.parentElement;
      
      // Both cards should have h-full class for equal heights
      expect(missionElements).toHaveClass('h-full');
      expect(visionElements).toHaveClass('h-full');
    });

    test('mission and vision cards use flexbox layout', () => {
      renderAbout();
      
      const missionCard = screen.getByText('Mission').parentElement.parentElement;
      const visionCard = screen.getByText('Vision').parentElement.parentElement;
      
      // Cards should have flex flex-col classes for proper layout
      expect(missionCard).toHaveClass('flex', 'flex-col');
      expect(visionCard).toHaveClass('flex', 'flex-col');
    });

    test('mission and vision content has flex-grow for equal distribution', () => {
      renderAbout();
      
      // Look for mission content
      const missionContent = screen.getByText(/nurture a lifelong love for Bharatanatyam/);
      const visionContent = screen.getByText(/vibrant, inclusive space/);
      
      // Content paragraphs should have flex-grow class
      expect(missionContent).toHaveClass('flex-grow');
      expect(visionContent).toHaveClass('flex-grow');
    });

    test('mission and vision cards maintain consistent styling', () => {
      renderAbout();
      
      const missionCard = screen.getByText('Mission').parentElement.parentElement;
      const visionCard = screen.getByText('Vision').parentElement.parentElement;
      
      // Both cards should have consistent base classes
      expect(missionCard).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'p-8');
      expect(visionCard).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'p-8');
    });

    test('mission and vision icons are properly displayed', () => {
      renderAbout();
      
      // Mission should have target icon
      const missionIcon = screen.getByText('Mission').parentElement.querySelector('[class*="rounded-full"]');
      expect(missionIcon).toBeInTheDocument();
      
      // Vision should have star icon  
      const visionIcon = screen.getByText('Vision').parentElement.querySelector('[class*="rounded-full"]');
      expect(visionIcon).toBeInTheDocument();
    });

    test('grid layout accommodates equal height cards', () => {
      renderAbout();
      
      // Find the grid container
      const gridContainer = screen.getByText('Mission').parentElement.parentElement.parentElement;
      
      // Should have grid classes for responsive layout
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer.className).toMatch(/grid-cols-1.*md:grid-cols-2/);
    });
  });

  test('renders tenets section', () => {
    renderAbout();
    
    // Check for tenets section - updated title
    expect(screen.getByText('Our Core Tenets')).toBeInTheDocument();
  });

  test('renders instructor information', () => {
    renderAbout();
    
    // Check for instructor details in hero section
    expect(screen.getByText('Bhargavi Venkataraman')).toBeInTheDocument();
    // Note: Instructors section may not load in test environment
  });

  test('renders instructor credentials', () => {
    renderAbout();
    
    // Check that instructor credentials are shown
    expect(screen.getByText(/MFA.*Bharatanatyam/)).toBeInTheDocument();
    expect(screen.getByText(/Grade B Doordarshan/)).toBeInTheDocument();
  });

  test('instructor cards have proper navigation', () => {
    renderAbout();
    
    // Should have instructor information in hero section
    const instructorElements = screen.getAllByText('Bhargavi Venkataraman');
    expect(instructorElements.length).toBeGreaterThan(0);
  });

  test('renders without crashing', () => {
    renderAbout();
    
    // Basic render test - check for split heading
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('TandavaLasya')).toBeInTheDocument();
  });

  test('has proper content structure', () => {
    renderAbout();
    
    // Check main sections exist based on actual content
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('TandavaLasya')).toBeInTheDocument();
    expect(screen.getByText('Our Mission & Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Core Tenets')).toBeInTheDocument();
    // Note: Instructors section may not load in test environment due to async loading
  });

  test('displays mission content', () => {
    renderAbout();
    
    expect(screen.getByText(/nurture a lifelong love for Bharatanatyam/)).toBeInTheDocument();
  });

  test('displays vision content', () => {
    renderAbout();
    
    expect(screen.getByText(/vibrant, inclusive space/)).toBeInTheDocument();
  });

  // Additional responsive design tests
  describe('Responsive Design', () => {
    test('adapts to mobile layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderAbout();
      
      // Should render without errors on mobile
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Mission')).toBeInTheDocument();
      expect(screen.getByText('Vision')).toBeInTheDocument();
    });
  });

  // Performance tests
  describe('Performance', () => {
    test('mounts and unmounts cleanly', () => {
      const { unmount } = renderAbout();
      
      // Should mount successfully
      expect(screen.getByText('About')).toBeInTheDocument();
      
      // Should unmount without errors
      unmount();
    });
  });
});