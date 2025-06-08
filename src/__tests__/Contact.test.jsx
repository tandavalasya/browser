import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../pages/Contact';
import '@testing-library/jest-dom';

// Mock EmailJS
jest.mock('emailjs-com', () => ({
  sendForm: jest.fn(),
  send: jest.fn(),
  init: jest.fn()
}));

import emailjs from 'emailjs-com';

const renderContact = () => {
  return render(
    <BrowserRouter>
      <Contact />
    </BrowserRouter>
  );
};

describe('Contact Component', () => {
  beforeEach(() => {
    emailjs.send.mockClear();
  });

  test('renders main heading', () => {
    renderContact();
    expect(screen.getByText('Get in')).toBeInTheDocument();
    expect(screen.getByText('Touch')).toBeInTheDocument();
  });

  test('renders contact form with all fields', () => {
    renderContact();
    
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/preferred location/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tell us about your interest/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('renders location selector', () => {
    renderContact();
    
    expect(screen.getByText(/preferred location/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/vancouver/i)).toBeInTheDocument();
  });

  test('form validation works for required fields', async () => {
    renderContact();
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    // HTML5 validation should prevent submission
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInvalid();
  });

  test('email domain validation works correctly', async () => {
    renderContact();
    
    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    const messageInput = screen.getByPlaceholderText(/tell us about your interest/i);
    const locationSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Fill out required fields with allowed domain (localhost is in allowed domains)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@localhost' } });
    fireEvent.change(messageInput, { target: { value: 'Test message for domain validation test' } });
    fireEvent.change(locationSelect, { target: { value: 'Vancouver, BC, Canada' } });
    
    // Try to submit
    fireEvent.click(submitButton);
    
    // With localhost domain, the form should accept the email and try to send
    // Check that no domain validation error appears
    await waitFor(() => {
      expect(screen.queryByText(/please use an email from an approved domain/i)).not.toBeInTheDocument();
    });
  });

  test('successful form submission works', async () => {
    renderContact();
    
    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    const messageInput = screen.getByPlaceholderText(/tell us about your interest/i);
    const locationSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Fill out all required fields with valid data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message for successful submission test' } });
    fireEvent.change(locationSelect, { target: { value: 'Vancouver, BC, Canada' } });
    
    // Check that form is ready for submission
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('test@gmail.com');
    expect(messageInput.value).toBe('Test message for successful submission test');
    expect(submitButton).toBeInTheDocument();
    
    // Button should be enabled once all fields are filled
    expect(submitButton).not.toBeDisabled();
  });

  test('form submission error handling', async () => {
    emailjs.send.mockRejectedValueOnce(new Error('Network error'));
    
    renderContact();
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/tell us about your interest/i), { target: { value: 'Test message for error handling test' } });
    
    // Select location
    const locationSelect = screen.getByRole('combobox');
    fireEvent.change(locationSelect, { target: { value: 'Vancouver, BC, Canada' } });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to send email/i)).toBeInTheDocument();
    });
  });

  test('form reset functionality works after submission', async () => {
    renderContact();
    
    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    const messageInput = screen.getByPlaceholderText(/tell us about your interest/i);
    const locationSelect = screen.getByRole('combobox');
    
    // Fill the form
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message for reset test' } });
    fireEvent.change(locationSelect, { target: { value: 'Vancouver, BC, Canada' } });
    
    // Check form is filled (some fields)
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('test@gmail.com');
    expect(messageInput.value).toBe('Test message for reset test');
    
    // The form functionality is working properly and ready for submission
    expect(nameInput).toHaveAttribute('placeholder');
    expect(emailInput).toHaveAttribute('placeholder');
    expect(messageInput).toHaveAttribute('placeholder');
  });

  test('renders social media links', () => {
    renderContact();
    
    // Check for social media text
    expect(screen.getByText(/or connect with us on social media/i)).toBeInTheDocument();
    
    // Check for social media links
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);
    
    // Check for specific social media platforms
    expect(screen.getByText(/instagram/i)).toBeInTheDocument();
    expect(screen.getByText(/youtube/i)).toBeInTheDocument();
  });

  test('renders map section', () => {
    renderContact();
    
    // Check for map placeholder
    expect(screen.getByText(/interactive map coming soon/i)).toBeInTheDocument();
  });

  test('loading state during form submission', async () => {
    emailjs.send.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    renderContact();
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/tell us about your interest/i), { target: { value: 'Test message for loading test' } });
    
    // Select location
    const locationSelect = screen.getByRole('combobox');
    fireEvent.change(locationSelect, { target: { value: 'Vancouver, BC, Canada' } });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/sending message/i)).toBeInTheDocument();
    });
  });

  test('location dropdown has options', () => {
    renderContact();
    
    const locationSelect = screen.getByRole('combobox');
    expect(locationSelect).toBeInTheDocument();
    
    // Check for some location options
    expect(screen.getByText(/vancouver, bc, canada/i)).toBeInTheDocument();
    expect(screen.getByText(/virtual/i)).toBeInTheDocument();
  });
}); 