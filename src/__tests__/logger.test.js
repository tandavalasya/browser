/**
 * Logger Utility Tests
 * Tests for both browser and Node.js environments
 * Ensures no runtime errors from process access
 */

import { Logger, logger } from '../core/utils/logger.util.js';

describe('Logger Utility', () => {
  let consoleErrorSpy, consoleWarnSpy, consoleInfoSpy, consoleDebugSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('Environment Safety', () => {
    test('should not throw when process is undefined (browser environment)', () => {
      // Simulate browser environment where process is undefined
      const originalProcess = global.process;
      delete global.process;
      
      expect(() => {
        new Logger();
      }).not.toThrow();
      
      // Restore process
      global.process = originalProcess;
    });

    test('should not throw when window is undefined (Node.js environment)', () => {
      // Simulate Node.js environment
      const originalWindow = global.window;
      delete global.window;
      
      expect(() => {
        new Logger();
      }).not.toThrow();
      
      // Restore window if it existed
      if (originalWindow) {
        global.window = originalWindow;
      }
    });

    test('should handle missing import.meta gracefully', () => {
      // Simulate environment without import.meta
      const originalImportMeta = global.import;
      delete global.import;
      
      expect(() => {
        new Logger();
      }).not.toThrow();
      
      // Restore import.meta if it existed
      if (originalImportMeta) {
        global.import = originalImportMeta;
      }
    });

    test('should work with default values when environment variables are unavailable', () => {
      const testLogger = new Logger();
      
      // Should default to production mode and info level
      expect(testLogger.isDevelopment).toBeDefined();
      expect(testLogger.logLevel).toBeDefined();
    });
  });

  describe('Singleton Instance', () => {
    test('should export a singleton instance', () => {
      expect(logger).toBeInstanceOf(Logger);
    });

    test('should be the same instance when imported multiple times', () => {
      const { logger: logger2 } = require('../core/utils/logger.util.js');
      expect(logger).toBe(logger2);
    });
  });

  describe('Logging Methods', () => {
    test('should log error messages without throwing', () => {
      expect(() => {
        logger.error('Test error message');
      }).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test('should log info messages without throwing', () => {
      expect(() => {
        logger.info('Test info message');
      }).not.toThrow();
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    test('should handle error with data object', () => {
      const errorData = { stack: 'test stack', code: 'TEST_ERROR' };
      expect(() => {
        logger.error('Test error with data', errorData);
      }).not.toThrow();
    });

    test('should format timestamps correctly', () => {
      logger.info('Test message');
      
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message/)
      );
    });
  });

  describe('Log Levels', () => {
    test('should respect log level hierarchy', () => {
      const testLogger = new Logger();
      
      // Manually set log level to warn
      testLogger.logLevel = 'warn';
      
      testLogger.error('Error message');
      testLogger.warn('Warning message'); 
      testLogger.info('Info message');
      testLogger.debug('Debug message');
      
      // Should log error and warn, but not info or debug
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe('Development Mode Features', () => {
    test('should provide timing methods without throwing', () => {
      expect(() => {
        logger.time('test-timer');
        logger.timeEnd('test-timer');
      }).not.toThrow();
    });

    test('should provide grouping methods without throwing', () => {
      expect(() => {
        logger.group('test-group');
        logger.groupEnd();
      }).not.toThrow();
    });
  });

  describe('Browser Environment Simulation', () => {
    test('should handle browser environment with Vite env vars', () => {
      // Mock browser environment with Vite
      const originalWindow = global.window;
      const originalImportMeta = global.import;
      
      global.window = {};
      global.import = {
        meta: {
          env: {
            VITE_NODE_ENV: 'development',
            VITE_REACT_APP_LOG_LEVEL: 'debug'
          }
        }
      };
      
      expect(() => {
        const testLogger = new Logger();
        testLogger.info('Test in browser env');
      }).not.toThrow();
      
      // Cleanup
      if (originalWindow) {
        global.window = originalWindow;
      } else {
        delete global.window;
      }
      
      if (originalImportMeta) {
        global.import = originalImportMeta;
      } else {
        delete global.import;
      }
    });
  });

  describe('Error Resilience', () => {
    test('should handle null and undefined gracefully', () => {
      expect(() => {
        logger.info(null);
        logger.info(undefined);
        logger.error('Error', null);
        logger.warn('Warning', undefined);
      }).not.toThrow();
    });

    test('should handle extremely long messages', () => {
      const longMessage = 'A'.repeat(10000);
      
      expect(() => {
        logger.info(longMessage);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('should not significantly impact performance when logging is disabled', () => {
      const testLogger = new Logger();
      testLogger.logLevel = 'error'; // Only allow errors
      
      const start = Date.now();
      
      // Attempt many info/debug calls that should be filtered out
      for (let i = 0; i < 1000; i++) {
        testLogger.info('Performance test message', { iteration: i });
        testLogger.debug('Debug message', { data: 'test' });
      }
      
      const end = Date.now();
      const duration = end - start;
      
      // Should complete quickly (under 100ms) since most calls are filtered
      expect(duration).toBeLessThan(100);
    });
  });
}); 