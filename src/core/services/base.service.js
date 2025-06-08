/**
 * Base Service Class
 * Implements common service functionality following SOLID principles
 * - Single Responsibility: Handles common HTTP operations
 * - Open/Closed: Can be extended by specific services
 * - Dependency Inversion: Depends on abstractions, not concretions
 */

import { errorHandler } from '../utils/error-handler.util.js';
import { logger } from '../utils/logger.util.js';
import { APP_CONSTANTS } from '../constants/app.constants.js';

export class BaseService {
  constructor(baseURL = '', defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
    this.timeout = APP_CONSTANTS.API.TIMEOUT;
  }

  /**
   * Generic HTTP request method with error handling and retry logic
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async request(url, options = {}) {
    const fullUrl = this.#buildUrl(url);
    const requestOptions = this.#buildRequestOptions(options);

    return errorHandler.handleWithRetry(
      () => this.#executeRequest(fullUrl, requestOptions),
      APP_CONSTANTS.API.RETRY_ATTEMPTS,
      APP_CONSTANTS.API.RETRY_DELAY,
      `HTTP ${options.method || 'GET'} ${fullUrl}`
    );
  }

  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async post(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null
    });
  }

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async put(url, data = null, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null
    });
  }

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} - Response data
   */
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  /**
   * Build full URL from base URL and endpoint
   * @private
   */
  #buildUrl(url) {
    if (url.startsWith('http')) {
      return url; // Absolute URL
    }
    return `${this.baseURL}${url}`;
  }

  /**
   * Build request options with defaults
   * @private
   */
  #buildRequestOptions(options) {
    return {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      signal: this.#createAbortSignal()
    };
  }

  /**
   * Create abort signal for request timeout
   * @private
   */
  #createAbortSignal() {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller.signal;
  }

  /**
   * Execute the actual HTTP request
   * @private
   */
  async #executeRequest(url, options) {
    logger.debug('HTTP Request:', { url, method: options.method });
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      logger.debug('HTTP Response:', { url, status: response.status, dataType: typeof data });
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }
}

// Export default instance for convenience
export const baseService = new BaseService(); 