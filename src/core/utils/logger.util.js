/**
 * Centralized logging utility
 * Follows Single Responsibility Principle - only handles logging
 * Can be easily extended or replaced with external logging services
 */

class Logger {
  constructor() {
    // Safe browser environment checks
    this.isDevelopment = this.#getSafeEnvVar('NODE_ENV') === 'development';
    this.logLevel = this.#getSafeEnvVar('REACT_APP_LOG_LEVEL') || 'info';
  }

  #getSafeEnvVar(key) {
    try {
      // In Node.js environment (tests, SSR)
      if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
      }
      
      // In browser environment, use safe defaults
      // Environment variables should be injected at build time by bundler
      if (typeof window !== 'undefined') {
        return key === 'NODE_ENV' ? 'production' : undefined;
      }
      
      // Default fallback
      return key === 'NODE_ENV' ? 'production' : undefined;
    } catch (error) {
      // Final fallback if any error occurs
      return key === 'NODE_ENV' ? 'production' : undefined;
    }
  }

  #shouldLog(level) {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return levels[level] <= levels[this.logLevel];
  }

  #formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data) {
      return { message: `${prefix} ${message}`, data };
    }
    return `${prefix} ${message}`;
  }

  error(message, error = null) {
    if (!this.#shouldLog('error')) return;
    
    const formatted = this.#formatMessage('error', message, error);
    
    if (error) {
      console.error(formatted.message, formatted.data);
    } else {
      console.error(formatted);
    }
  }

  warn(message, data = null) {
    if (!this.#shouldLog('warn')) return;
    
    const formatted = this.#formatMessage('warn', message, data);
    
    if (data) {
      console.warn(formatted.message, formatted.data);
    } else {
      console.warn(formatted);
    }
  }

  info(message, data = null) {
    if (!this.#shouldLog('info')) return;
    
    const formatted = this.#formatMessage('info', message, data);
    
    if (data) {
      console.info(formatted.message, formatted.data);
    } else {
      console.info(formatted);
    }
  }

  debug(message, data = null) {
    if (!this.isDevelopment || !this.#shouldLog('debug')) return;
    
    const formatted = this.#formatMessage('debug', message, data);
    
    if (data) {
      console.debug(formatted.message, formatted.data);
    } else {
      console.debug(formatted);
    }
  }

  // Performance logging
  time(label) {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label) {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  // Group logging for related operations
  group(label) {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing purposes
export { Logger }; 