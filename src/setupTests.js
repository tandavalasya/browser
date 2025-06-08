// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Create comprehensive framer-motion mock with proxy inside the mock factory
jest.mock('framer-motion', () => {
  const createMotionComponentMock = (component) => {
    const MockComponent = ({ children, ...props }) => {
      const React = require('react');
      return React.createElement(component, props, children);
    };
    MockComponent.displayName = `Motion${component.charAt(0).toUpperCase() + component.slice(1)}`;
    return MockComponent;
  };

  // List of all motion components that might be used
  const motionComponents = [
    'div', 'span', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'button', 'input', 'textarea',
    'form', 'label', 'select', 'option', 'img', 'video', 'audio', 'canvas', 'svg',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'figure', 'figcaption', 'time', 'mark', 'small', 'del', 'ins', 'sub', 'sup'
  ];

  // Create motion component mocks
  const motionMocks = {};
  motionComponents.forEach(component => {
    motionMocks[component] = createMotionComponentMock(component);
  });

  // Create a proxy for motion to handle any component dynamically
  const motionProxy = new Proxy(motionMocks, {
    get: function(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      // For any unknown motion component, create it dynamically
      if (typeof prop === 'string') {
        target[prop] = createMotionComponentMock(prop);
        return target[prop];
      }
      return undefined;
    }
  });

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useInView: () => true,
    useMotionValue: (initial) => ({ get: () => initial, set: jest.fn() }),
    useSpring: (value) => value,
    useTransform: (value, input, output) => value,
  };
});

// Mock static assets
jest.mock('*.jpg', () => 'test-file-stub', { virtual: true });
jest.mock('*.jpeg', () => 'test-file-stub', { virtual: true });
jest.mock('*.png', () => 'test-file-stub', { virtual: true });
jest.mock('*.gif', () => 'test-file-stub', { virtual: true });
jest.mock('*.svg', () => 'test-file-stub', { virtual: true });
jest.mock('*.css', () => ({}), { virtual: true });
jest.mock('*.scss', () => ({}), { virtual: true });
jest.mock('*.sass', () => ({}), { virtual: true });

// Reset fetch mock before each test
beforeEach(() => {
  fetch.mockClear();
});

// Mock framer-motion with a comprehensive proxy
jest.mock('framer-motion', () => {
  const React = require('react');
  
  const motion = new Proxy({}, {
    get(target, prop) {
      if (typeof prop === 'string') {
        return React.forwardRef((props, ref) => {
          const { children, ...restProps } = props;
          // Remove framer-motion specific props
          const cleanProps = { ...restProps };
          delete cleanProps.variants;
          delete cleanProps.initial;
          delete cleanProps.animate;
          delete cleanProps.exit;
          delete cleanProps.transition;
          delete cleanProps.whileHover;
          delete cleanProps.whileTap;
          delete cleanProps.whileInView;
          delete cleanProps.viewport;
          delete cleanProps.layoutId;
          
          return React.createElement(prop, { ...cleanProps, ref }, children);
        });
      }
      return target[prop];
    }
  });

  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn()
    }),
    useViewportScroll: () => ({
      scrollY: { current: 0 },
      scrollX: { current: 0 },
      scrollYProgress: { current: 0 },
      scrollXProgress: { current: 0 }
    })
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver
});

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver
});

// Add global TextEncoder for test environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
} 