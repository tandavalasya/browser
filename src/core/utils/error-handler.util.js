/**
 * Centralized error handling utility
 * Follows Single Responsibility Principle and provides consistent error handling across the app
 */

import { logger } from './logger.util.js';
import { ERROR_CONSTANTS } from '../constants/app.constants.js';

/**
 * Base error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, code = 'GENERAL_ERROR', originalError = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Network-related error
 */
export class NetworkError extends AppError {
  constructor(message = ERROR_CONSTANTS.NETWORK, originalError = null) {
    super(message, 'NETWORK_ERROR', originalError);
    this.name = 'NetworkError';
  }
}

/**
 * Validation-related error
 */
export class ValidationError extends AppError {
  constructor(message = ERROR_CONSTANTS.FORM_VALIDATION, originalError = null) {
    super(message, 'VALIDATION_ERROR', originalError);
    this.name = 'ValidationError';
  }
}

/**
 * API-related error
 */
export class ApiError extends AppError {
  constructor(message, statusCode = null, originalError = null) {
    super(message, 'API_ERROR', originalError);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Error Handler class - handles all error processing
 */
class ErrorHandler {
  /**
   * Handle error based on its type and context
   * @param {Error} error - The error to handle
   * @param {string} context - Context where error occurred
   * @param {Object} metadata - Additional metadata
   * @returns {Object} - Normalized error object
   */
  handle(error, context = 'Unknown', metadata = {}) {
    const normalizedError = this.#normalizeError(error);
    
    // Log the error
    logger.error(`Error in ${context}:`, {
      message: normalizedError.message,
      code: normalizedError.code,
      stack: normalizedError.stack,
      metadata,
      timestamp: normalizedError.timestamp
    });

    // Return user-friendly error for UI
    return {
      message: this.#getUserFriendlyMessage(normalizedError),
      code: normalizedError.code,
      timestamp: normalizedError.timestamp
    };
  }

  /**
   * Handle async operation errors with retry logic
   * @param {Function} operation - Async operation to execute
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Delay between retries in ms
   * @param {string} context - Context for logging
   * @returns {Promise} - Result of the operation
   */
  async handleWithRetry(operation, maxRetries = 3, delay = 1000, context = 'Operation') {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`${context}: Attempt ${attempt}/${maxRetries}`);
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }

        if (this.#shouldRetry(error)) {
          logger.warn(`${context}: Attempt ${attempt} failed, retrying in ${delay}ms`, { error: error.message });
          await this.#delay(delay);
          delay *= 2; // Exponential backoff
        } else {
          break;
        }
      }
    }

    throw this.#normalizeError(lastError);
  }

  /**
   * Normalize different error types to consistent format
   * @private
   */
  #normalizeError(error) {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof TypeError || error instanceof ReferenceError) {
      return new AppError(ERROR_CONSTANTS.GENERAL, 'CLIENT_ERROR', error);
    }

    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return new NetworkError(ERROR_CONSTANTS.NETWORK, error);
    }

    if (error.response) {
      // HTTP error response
      return new ApiError(
        error.response.data?.message || error.message,
        error.response.status,
        error
      );
    }

    return new AppError(error.message || ERROR_CONSTANTS.GENERAL, 'UNKNOWN_ERROR', error);
  }

  /**
   * Get user-friendly error message
   * @private
   */
  #getUserFriendlyMessage(error) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return ERROR_CONSTANTS.NETWORK;
      case 'VALIDATION_ERROR':
        return ERROR_CONSTANTS.FORM_VALIDATION;
      case 'API_ERROR':
        return error.statusCode >= 500 
          ? ERROR_CONSTANTS.GENERAL 
          : error.message;
      default:
        return ERROR_CONSTANTS.GENERAL;
    }
  }

  /**
   * Determine if error should be retried
   * @private
   */
  #shouldRetry(error) {
    if (error instanceof ValidationError) {
      return false; // Don't retry validation errors
    }

    if (error instanceof ApiError) {
      // Don't retry client errors (4xx), but retry server errors (5xx)
      return error.statusCode >= 500;
    }

    if (error instanceof NetworkError) {
      return true; // Retry network errors
    }

    return false;
  }

  /**
   * Delay execution
   * @private
   */
  #delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export class for testing
export { ErrorHandler }; 