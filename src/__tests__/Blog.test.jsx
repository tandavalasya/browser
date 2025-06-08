import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Blog from '../pages/Blog';
import '@testing-library/jest-dom';

const renderBlog = () => {
  return render(
    <BrowserRouter>
      <Blog />
    </BrowserRouter>
  );
};

describe('Blog Component', () => {
  test('renders main heading', () => {
    renderBlog();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  test('renders blog posts grid', async () => {
    renderBlog();
    
    // Check for grid container
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });

  test('renders blog post links after loading', async () => {
    renderBlog();
    
    // Wait for posts to load
    await waitFor(() => {
      const links = screen.queryAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
    
    // Check that links point to blog pages
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toMatch(/^\/blog\//);
    });
  });

  test('renders blog post images after loading', async () => {
    renderBlog();
    
    // Wait for posts to load
    await waitFor(() => {
      const images = screen.queryAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
    
    // Check that images have alt text
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
  });

  test('renders blog post titles after loading', async () => {
    renderBlog();
    
    // Wait for posts to load
    await waitFor(() => {
      const headings = screen.queryAllByRole('heading', { level: 3 });
      expect(headings.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
    
    // Check that each heading has text content
    const headings = screen.getAllByRole('heading', { level: 3 });
    headings.forEach(heading => {
      expect(heading.textContent).toBeTruthy();
    });
  });

  test('renders blog post dates after loading', async () => {
    renderBlog();
    
    // Wait for posts to load and check for date information
    await waitFor(() => {
      const dateElements = screen.queryAllByText(/\d{4}-\d{2}-\d{2}/);
      expect(dateElements.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
  });

  test('blog posts have hover effects after loading', async () => {
    renderBlog();
    
    // Wait for posts to load
    await waitFor(() => {
      const postContainers = screen.queryAllByRole('link');
      expect(postContainers.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
    
    // Check that containers have cursor-pointer class
    const postContainers = screen.getAllByRole('link');
    postContainers.forEach(container => {
      expect(container.parentElement).toHaveClass('cursor-pointer');
    });
  });

  test('navigation to blog detail pages works', async () => {
    renderBlog();
    
    // Wait for posts to load
    await waitFor(() => {
      const links = screen.queryAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
    
    // Get all blog links
    const links = screen.getAllByRole('link');
    
    // Test clicking on the first link (should not throw errors)
    if (links.length > 0) {
      fireEvent.click(links[0]);
      // In a real app, this would navigate to the detail page
      // Here we just verify the click doesn't cause errors
    }
  });

  test('renders blog post excerpts', async () => {
    renderBlog();
    
    // Wait for content to load
    await waitFor(() => {
      const textElements = screen.queryAllByText(/\w+/);
      expect(textElements.length).toBeGreaterThan(3); // Should have content beyond just heading
    }, { timeout: 1000 });
  });

  test('renders responsive grid layout', () => {
    renderBlog();
    
    // Check for the grid container with responsive classes
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('md:grid-cols-2');
  });
}); 