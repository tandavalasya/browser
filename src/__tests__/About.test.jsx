import { render, screen, fireEvent } from '@testing-library/react';
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
}));

const renderAbout = () => {
  return render(
    <BrowserRouter>
      <About />
    </BrowserRouter>
  );
};

describe('About Component', () => {
  test('renders main heading', () => {
    renderAbout();
    
    // Check for main heading
    expect(screen.getByText('About TandavaLasya')).toBeInTheDocument();
  });

  test('renders about tandavalasya section', () => {
    renderAbout();
    
    // Check for TandavaLasya content and instructor name
    expect(screen.getByText('About TandavaLasya')).toBeInTheDocument();
    expect(screen.getByText('Bhargavi Venkataraman')).toBeInTheDocument();
  });

  test('renders mission and vision section', () => {
    renderAbout();
    
    // Check for mission section
    expect(screen.getByText('Our Mission & Vision')).toBeInTheDocument();
  });

  test('renders tenets section', () => {
    renderAbout();
    
    // Check for tenets section  
    expect(screen.getByText('Our Tenets')).toBeInTheDocument();
  });

  test('renders instructor information', () => {
    renderAbout();
    
    // Check for instructor details
    expect(screen.getByText('Bhargavi Venkataraman')).toBeInTheDocument();
    expect(screen.getByText('Meet Our Instructors')).toBeInTheDocument();
  });

  test('renders instructor credentials', () => {
    renderAbout();
    
    // Check for instructor credentials in the intro text
    expect(screen.getByText(/MFA \(Bharatanatyam\)/)).toBeInTheDocument();
    expect(screen.getByText(/Grade B Doordarshan artist/)).toBeInTheDocument();
  });

  test('renders animated elements', () => {
    renderAbout();
    
    // Check that motion components are working (they should render as divs with motion attributes)
    const sections = document.querySelectorAll('[variants]');
    expect(sections.length).toBeGreaterThan(0);
  });

  test('renders without crashing', () => {
    renderAbout();
    
    // Basic render test
    expect(screen.getByText('About TandavaLasya')).toBeInTheDocument();
  });

  test('has proper content structure', () => {
    renderAbout();
    
    // Check main sections exist based on actual content
    expect(screen.getByText('About TandavaLasya')).toBeInTheDocument();
    expect(screen.getByText('Our Mission & Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Tenets')).toBeInTheDocument();
    expect(screen.getByText('Meet Our Instructors')).toBeInTheDocument();
  });

  test('contains bharatanatyam content', () => {
    renderAbout();
    
    // Check for bharatanatyam mentions in the actual content - there are multiple so use getAllByText
    const bharatanatyamElements = screen.getAllByText(/bharatanatyam/i);
    expect(bharatanatyamElements.length).toBeGreaterThan(0);
  });

  test('contains key text content', () => {
    renderAbout();
    
    // Check for actual text that exists in the component
    expect(screen.getByText(/tradition meets innovation/i)).toBeInTheDocument();
    expect(screen.getByText(/discover the joy and discipline/i)).toBeInTheDocument();
  });
}); 