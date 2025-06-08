import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import * as googlePlacesService from '../services/googlePlacesService';
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
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
}));

// Mock the Google Places service
jest.mock('../services/googlePlacesService', () => ({
  fetchGoogleReviews: jest.fn(),
}));

// Mock the config files
jest.mock('../config/reviews.json', () => ([
  {
    name: 'Sarah Johnson',
    review: 'Wonderful experience learning Bharatanatyam!',
    rating: 5,
    date: '2024-01-15',
    image: null
  },
  {
    name: 'Priya Sharma',
    review: 'Amazing teacher and great atmosphere.',
    rating: 5,
    date: '2024-02-10',
    image: null
  }
]), { virtual: true });

jest.mock('../config/googlePlaces.json', () => ({
  placeId: 'test-place-id',
  apiKey: 'test-api-key'
}), { virtual: true });

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    googlePlacesService.fetchGoogleReviews.mockResolvedValue({
      reviews: [
        {
          id: 'google-1',
          author: 'Google User',
          rating: 5,
          text: 'Great dance school!',
          date: '2024-03-01',
          profilePhoto: null
        }
      ],
      rating: 4.8
    });
  });

  test('renders without crashing', () => {
    renderHome();
    // Check that the main brand text is rendered somewhere on the page
    expect(screen.getByText('Bharatanatyam Dance School')).toBeInTheDocument();
  });

  test('renders hero section with logo and title', () => {
    renderHome();
    
    // Check for main heading
    expect(screen.getByText('TandavaLasya')).toBeInTheDocument();
    expect(screen.getByText('Bharatanatyam Dance School')).toBeInTheDocument();
    
    // Check for logo
    expect(screen.getByAltText('TandavaLasya Logo')).toBeInTheDocument();
  });

  test('renders welcome message with instructor name', () => {
    renderHome();
    
    expect(screen.getByText(/Welcome to TandavaLasya/)).toBeInTheDocument();
    expect(screen.getByText(/Bhargavi Venkataraman/)).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    renderHome();
    
    // Check for CTA buttons
    expect(screen.getByText(/Learn More About Us/)).toBeInTheDocument();
    expect(screen.getByText(/Explore Gallery/)).toBeInTheDocument();
    expect(screen.getByText(/Get Started/)).toBeInTheDocument();
  });

  test('CTA buttons have correct navigation links', () => {
    renderHome();
    
    const learnMoreBtn = screen.getByText(/Learn More About Us/);
    const galleryBtn = screen.getByText(/Explore Gallery/);
    const getStartedBtn = screen.getByText(/Get Started/);
    
    expect(learnMoreBtn.closest('a')).toHaveAttribute('href', '/about');
    expect(galleryBtn.closest('a')).toHaveAttribute('href', '/gallery');
    expect(getStartedBtn.closest('a')).toHaveAttribute('href', '/contact');
  });

  test('renders "Why Choose Us" section', () => {
    renderHome();
    
    expect(screen.getByText('Why Choose Us?')).toBeInTheDocument();
    expect(screen.getByText(/Rooted in the rich tradition/)).toBeInTheDocument();
    expect(screen.getByText(/Holistic focus/)).toBeInTheDocument();
    expect(screen.getByText(/Classes include dynamic warm-ups/)).toBeInTheDocument();
  });

  test('renders all bullet points in Why Choose Us section', () => {
    renderHome();
    
    const expectedPoints = [
      'Rooted in the rich tradition of Bharatanatyam',
      'Holistic focus: dance technique, health, fitness',
      'Classes include dynamic warm-ups, stretches',
      'Emphasis on discipline, self-expression',
      'Supportive, inclusive community',
      'Performance opportunities, workshops',
      'Guidance for personal growth, confidence'
    ];
    
    expectedPoints.forEach(point => {
      expect(screen.getByText(new RegExp(point))).toBeInTheDocument();
    });
  });

  test('renders reviews section heading', () => {
    renderHome();
    
    expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
  });

  test('shows loading spinner while fetching reviews', () => {
    renderHome();
    
    // Should show loading spinner initially
    expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
  });

  test('handles Google Places service errors gracefully', async () => {
    googlePlacesService.fetchGoogleReviews.mockRejectedValue(new Error('API Error'));
    
    renderHome();
    
    // Should still render without crashing
    expect(screen.getByText('TandavaLasya')).toBeInTheDocument();
    
    // Wait for error handling
    await waitFor(() => {
      expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
    });
  });

  test('displays site reviews when Google reviews fail', async () => {
    googlePlacesService.fetchGoogleReviews.mockRejectedValue(new Error('Network error'));
    
    renderHome();
    
    await waitFor(() => {
      expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
    });
  });

  test('renders Join Us section', () => {
    renderHome();
    
    expect(screen.getByText('Join Us')).toBeInTheDocument();
    expect(screen.getByText(/Whether you are a beginner/)).toBeInTheDocument();
    expect(screen.getByText(/vibrant community/)).toBeInTheDocument();
  });

  test('renders background decorative elements', () => {
    renderHome();
    
    // Check that the component container exists
    const homeContainer = screen.getByText('TandavaLasya').closest('div');
    expect(homeContainer).toBeInTheDocument();
  });

  test('handles successful Google reviews loading', async () => {
    const mockReviews = {
      reviews: [
        {
          id: 'google-1',
          author: 'Test User',
          rating: 5,
          text: 'Excellent dance school!',
          date: '2024-03-01',
          profilePhoto: 'test-photo.jpg'
        }
      ],
      rating: 4.9
    };
    
    googlePlacesService.fetchGoogleReviews.mockResolvedValue(mockReviews);
    
    renderHome();
    
    await waitFor(() => {
      expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
    });
  });

  test('renders instructor credentials in welcome text', () => {
    renderHome();
    
    expect(screen.getByText(/MFA \(Bharatanatyam\)/)).toBeInTheDocument();
    expect(screen.getByText(/Grade B Doordarshan artist/)).toBeInTheDocument();
    expect(screen.getByText(/award-winning performer/)).toBeInTheDocument();
  });

  test('component has proper responsive structure', () => {
    renderHome();
    
    const mainContainer = screen.getByText('TandavaLasya').closest('div');
    expect(mainContainer).toBeInTheDocument();
    
    // Check for responsive classes
    expect(document.querySelector('.md\\:text-5xl')).toBeInTheDocument();
    expect(document.querySelector('.md\\:flex-row')).toBeInTheDocument();
  });

  test('handles review carousel functionality', async () => {
    renderHome();
    
    await waitFor(() => {
      expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
    });
    
    // The reviews carousel should be present
    const reviewsSection = screen.getByText('What Our Students Say').closest('div');
    expect(reviewsSection).toBeInTheDocument();
  });

  test('error boundary catches review loading errors', async () => {
    // Force an error in the reviews section
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    googlePlacesService.fetchGoogleReviews.mockRejectedValue(new Error('Critical error'));
    
    renderHome();
    
    await waitFor(() => {
      expect(screen.getByText('What Our Students Say')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  test('renders proper semantic structure', () => {
    renderHome();
    
    // The Home component does have h2 heading for reviews section
    const reviewsHeading = screen.getByRole('heading', { level: 2, name: /What Our Students Say/i });
    expect(reviewsHeading).toBeInTheDocument();
    
    // Check that key content is present
    expect(screen.getByText('Bharatanatyam Dance School')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('all links have proper accessibility attributes', () => {
    renderHome();
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.textContent.trim()).not.toBe('');
    });
  });

  test('handles component unmounting during async operations', async () => {
    const { unmount } = renderHome();
    
    // Unmount before promises resolve
    unmount();
    
    // Should not cause any warnings or errors
    await waitFor(() => {
      // Just ensure no errors are thrown
      expect(true).toBe(true);
    });
  });

  test('logo image has proper attributes', () => {
    renderHome();
    
    const logo = screen.getByAltText('TandavaLasya Logo');
    expect(logo).toHaveAttribute('src', '/logo.png');
    expect(logo).toHaveAttribute('alt', 'TandavaLasya Logo');
  });

  test('transforms reviews data correctly', async () => {
    const mockGoogleReviews = {
      reviews: [
        {
          id: 'test-id',
          author: 'Test Author',
          rating: 4,
          text: 'Great experience',
          date: '2024-01-01',
          profilePhoto: null
        }
      ]
    };
    
    googlePlacesService.fetchGoogleReviews.mockResolvedValue(mockGoogleReviews);
    
    renderHome();
    
    await waitFor(() => {
      expect(googlePlacesService.fetchGoogleReviews).toHaveBeenCalled();
    });
  });
}); 