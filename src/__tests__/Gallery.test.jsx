import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Gallery from '../pages/Gallery';
import '@testing-library/jest-dom';

const renderGallery = () => {
  return render(
    <BrowserRouter>
      <Gallery />
    </BrowserRouter>
  );
};

describe('Gallery Component', () => {
  test('renders main heading', () => {
    renderGallery();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  test('renders Events tab button', () => {
    renderGallery();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  test('Events tab is active by default', () => {
    renderGallery();
    const eventsButton = screen.getByText('Events');
    expect(eventsButton).toHaveClass('bg-pink-500');
  });

  test('renders gallery events', () => {
    renderGallery();
    
    // Get all links in the gallery
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    // Check that links point to gallery pages
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toMatch(/^\/gallery\//);
    });
  });

  test('renders gallery images with proper alt text', () => {
    renderGallery();
    
    // Get all images in the gallery
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Check that images have alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  test('renders event titles and descriptions', () => {
    renderGallery();
    
    // Check for headings (event titles)
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBeGreaterThan(0);
    
    // Check that each heading has text content
    headings.forEach(heading => {
      expect(heading.textContent).toBeTruthy();
    });
  });

  test('gallery events have hover effects', () => {
    renderGallery();
    
    // Get all gallery event containers
    const eventContainers = screen.getAllByRole('link');
    expect(eventContainers.length).toBeGreaterThan(0);
    
    // Check that containers have cursor-pointer class
    eventContainers.forEach(container => {
      expect(container.parentElement).toHaveClass('cursor-pointer');
    });
  });

  test('navigation to gallery detail pages works', () => {
    renderGallery();
    
    // Get all gallery links
    const links = screen.getAllByRole('link');
    
    // Test clicking on the first link (should not throw errors)
    if (links.length > 0) {
      fireEvent.click(links[0]);
      // In a real app, this would navigate to the detail page
      // Here we just verify the click doesn't cause errors
    }
  });

  test('renders event dates', () => {
    renderGallery();
    
    // Check for date information in the content
    const dateElements = screen.getAllByText(/\d{4}-\d{2}-\d{2}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  test('renders responsive grid layout', () => {
    renderGallery();
    
    // Check for the grid container directly
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('md:grid-cols-2');
  });
}); 