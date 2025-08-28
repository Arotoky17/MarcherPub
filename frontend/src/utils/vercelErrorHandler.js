// Vercel Error Handler Utility
// Provides utilities for handling Vercel-specific errors in the frontend application

// Error code categories
export const ERROR_CATEGORIES = {
  APPLICATION: 'Application',
  PLATFORM: 'Platform'
};

// Application errors with their HTTP status codes
export const APPLICATION_ERRORS = {
  BODY_NOT_A_STRING_FROM_FUNCTION: { code: 'BODY_NOT_A_STRING_FROM_FUNCTION', category: 'Function', status: 502 },
  DEPLOYMENT_BLOCKED: { code: 'DEPLOYMENT_BLOCKED', category: 'Deployment', status: 403 },
  DEPLOYMENT_DELETED: { code: 'DEPLOYMENT_DELETED', category: 'Deployment', status: 410 },
  DEPLOYMENT_DISABLED: { code: 'DEPLOYMENT_DISABLED', category: 'Deployment', status: 402 },
  DEPLOYMENT_NOT_FOUND: { code: 'DEPLOYMENT_NOT_FOUND', category: 'Deployment', status: 404 },
  DEPLOYMENT_NOT_READY_REDIRECTING: { code: 'DEPLOYMENT_NOT_READY_REDIRECTING', category: 'Deployment', status: 303 },
  DEPLOYMENT_PAUSED: { code: 'DEPLOYMENT_PAUSED', category: 'Deployment', status: 503 },
  DNS_HOSTNAME_EMPTY: { code: 'DNS_HOSTNAME_EMPTY', category: 'DNS', status: 502 },
  DNS_HOSTNAME_NOT_FOUND: { code: 'DNS_HOSTNAME_NOT_FOUND', category: 'DNS', status: 502 },
  DNS_HOSTNAME_RESOLVE_FAILED: { code: 'DNS_HOSTNAME_RESOLVE_FAILED', category: 'DNS', status: 502 },
  DNS_HOSTNAME_RESOLVED_PRIVATE: { code: 'DNS_HOSTNAME_RESOLVED_PRIVATE', category: 'DNS', status: 404 },
  DNS_HOSTNAME_SERVER_ERROR: { code: 'DNS_HOSTNAME_SERVER_ERROR', category: 'DNS', status: 502 },
  EDGE_FUNCTION_INVOCATION_FAILED: { code: 'EDGE_FUNCTION_INVOCATION_FAILED', category: 'Function', status: 500 },
  EDGE_FUNCTION_INVOCATION_TIMEOUT: { code: 'EDGE_FUNCTION_INVOCATION_TIMEOUT', category: 'Function', status: 504 },
  FALLBACK_BODY_TOO_LARGE: { code: 'FALLBACK_BODY_TOO_LARGE', category: 'Cache', status: 502 },
  FUNCTION_INVOCATION_FAILED: { code: 'FUNCTION_INVOCATION_FAILED', category: 'Function', status: 500 },
  FUNCTION_INVOCATION_TIMEOUT: { code: 'FUNCTION_INVOCATION_TIMEOUT', category: 'Function', status: 504 },
  FUNCTION_PAYLOAD_TOO_LARGE: { code: 'FUNCTION_PAYLOAD_TOO_LARGE', category: 'Function', status: 413 },
  FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE: { code: 'FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE', category: 'Function', status: 500 },
  FUNCTION_THROTTLED: { code: 'FUNCTION_THROTTLED', category: 'Function', status: 503 },
  INFINITE_LOOP_DETECTED: { code: 'INFINITE_LOOP_DETECTED', category: 'Runtime', status: 508 },
  INVALID_IMAGE_OPTIMIZE_REQUEST: { code: 'INVALID_IMAGE_OPTIMIZE_REQUEST', category: 'Image', status: 400 },
  INVALID_REQUEST_METHOD: { code: 'INVALID_REQUEST_METHOD', category: 'Request', status: 405 },
  MALFORMED_REQUEST_HEADER: { code: 'MALFORMED_REQUEST_HEADER', category: 'Request', status: 400 },
  MICROFRONTENDS_MIDDLEWARE_ERROR: { code: 'MICROFRONTENDS_MIDDLEWARE_ERROR', category: 'Function', status: 500 },
  MIDDLEWARE_INVOCATION_FAILED: { code: 'MIDDLEWARE_INVOCATION_FAILED', category: 'Function', status: 500 },
  MIDDLEWARE_INVOCATION_TIMEOUT: { code: 'MIDDLEWARE_INVOCATION_TIMEOUT', category: 'Function', status: 504 },
  MIDDLEWARE_RUNTIME_DEPRECATED: { code: 'MIDDLEWARE_RUNTIME_DEPRECATED', category: 'Runtime', status: 503 },
  NO_RESPONSE_FROM_FUNCTION: { code: 'NO_RESPONSE_FROM_FUNCTION', category: 'Function', status: 502 },
  NOT_FOUND: { code: 'NOT_FOUND', category: 'Deployment', status: 404 },
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED: { code: 'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED', category: 'Image', status: 502 },
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID: { code: 'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID', category: 'Image', status: 502 },
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED: { code: 'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED', category: 'Image', status: 502 },
  OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS: { code: 'OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS', category: 'Image', status: 502 },
  RANGE_END_NOT_VALID: { code: 'RANGE_END_NOT_VALID', category: 'Request', status: 416 },
  RANGE_GROUP_NOT_VALID: { code: 'RANGE_GROUP_NOT_VALID', category: 'Request', status: 416 },
  RANGE_MISSING_UNIT: { code: 'RANGE_MISSING_UNIT', category: 'Request', status: 416 },
  RANGE_START_NOT_VALID: { code: 'RANGE_START_NOT_VALID', category: 'Request', status: 416 },
  RANGE_UNIT_NOT_SUPPORTED: { code: 'RANGE_UNIT_NOT_SUPPORTED', category: 'Request', status: 416 },
  REQUEST_HEADER_TOO_LARGE: { code: 'REQUEST_HEADER_TOO_LARGE', category: 'Request', status: 431 },
  RESOURCE_NOT_FOUND: { code: 'RESOURCE_NOT_FOUND', category: 'Request', status: 404 },
  ROUTER_CANNOT_MATCH: { code: 'ROUTER_CANNOT_MATCH', category: 'Routing', status: 502 },
  ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR: { code: 'ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR', category: 'Routing', status: 502 },
  ROUTER_EXTERNAL_TARGET_ERROR: { code: 'ROUTER_EXTERNAL_TARGET_ERROR', category: 'Routing', status: 502 },
  ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR: { code: 'ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR', category: 'Routing', status: 502 },
  ROUTER_TOO_MANY_HAS_SELECTIONS: { code: 'ROUTER_TOO_MANY_HAS_SELECTIONS', category: 'Routing', status: 502 },
  TOO_MANY_FILESYSTEM_CHECKS: { code: 'TOO_MANY_FILESYSTEM_CHECKS', category: 'Routing', status: 502 },
  TOO_MANY_FORKS: { code: 'TOO_MANY_FORKS', category: 'Routing', status: 502 },
  TOO_MANY_RANGES: { code: 'TOO_MANY_RANGES', category: 'Request', status: 416 },
  URL_TOO_LONG: { code: 'URL_TOO_LONG', category: 'Request', status: 414 }
};

// Platform errors with their HTTP status codes
export const PLATFORM_ERRORS = {
  FUNCTION_THROTTLED: { code: 'FUNCTION_THROTTLED', category: 'Internal', status: 500 },
  INTERNAL_CACHE_ERROR: { code: 'INTERNAL_CACHE_ERROR', category: 'Internal', status: 500 },
  INTERNAL_CACHE_KEY_TOO_LONG: { code: 'INTERNAL_CACHE_KEY_TOO_LONG', category: 'Internal', status: 500 },
  INTERNAL_CACHE_LOCK_FULL: { code: 'INTERNAL_CACHE_LOCK_FULL', category: 'Internal', status: 500 },
  INTERNAL_CACHE_LOCK_TIMEOUT: { code: 'INTERNAL_CACHE_LOCK_TIMEOUT', category: 'Internal', status: 500 },
  INTERNAL_DEPLOYMENT_FETCH_FAILED: { code: 'INTERNAL_DEPLOYMENT_FETCH_FAILED', category: 'Internal', status: 500 },
  INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED: { code: 'INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED', category: 'Internal', status: 500 },
  INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT: { code: 'INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT', category: 'Internal', status: 500 },
  INTERNAL_FUNCTION_INVOCATION_FAILED: { code: 'INTERNAL_FUNCTION_INVOCATION_FAILED', category: 'Internal', status: 500 },
  INTERNAL_FUNCTION_INVOCATION_TIMEOUT: { code: 'INTERNAL_FUNCTION_INVOCATION_TIMEOUT', category: 'Internal', status: 500 },
  INTERNAL_FUNCTION_NOT_FOUND: { code: 'INTERNAL_FUNCTION_NOT_FOUND', category: 'Internal', status: 500 },
  INTERNAL_FUNCTION_NOT_READY: { code: 'INTERNAL_FUNCTION_NOT_READY', category: 'Internal', status: 500 },
  INTERNAL_FUNCTION_SERVICE_UNAVAILABLE: { code: 'INTERNAL_FUNCTION_SERVICE_UNAVAILABLE', category: 'Internal', status: 500 },
  INTERNAL_MICROFRONTENDS_BUILD_ERROR: { code: 'INTERNAL_MICROFRONTENDS_BUILD_ERROR', category: 'Internal', status: 500 },
  INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR: { code: 'INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR', category: 'Internal', status: 500 },
  INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR: { code: 'INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR', category: 'Internal', status: 500 },
  INTERNAL_MISSING_RESPONSE_FROM_CACHE: { code: 'INTERNAL_MISSING_RESPONSE_FROM_CACHE', category: 'Internal', status: 500 },
  INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED: { code: 'INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED', category: 'Internal', status: 500 },
  INTERNAL_ROUTER_CANNOT_PARSE_PATH: { code: 'INTERNAL_ROUTER_CANNOT_PARSE_PATH', category: 'Internal', status: 500 },
  INTERNAL_STATIC_REQUEST_FAILED: { code: 'INTERNAL_STATIC_REQUEST_FAILED', category: 'Internal', status: 500 },
  INTERNAL_UNARCHIVE_FAILED: { code: 'INTERNAL_UNARCHIVE_FAILED', category: 'Internal', status: 500 },
  INTERNAL_UNEXPECTED_ERROR: { code: 'INTERNAL_UNEXPECTED_ERROR', category: 'Internal', status: 500 }
};

// All Vercel errors combined
export const VERCEL_ERRORS = {
  ...APPLICATION_ERRORS,
  ...PLATFORM_ERRORS
};

/**
 * Get error information by error code
 * @param {string} errorCode - The Vercel error code
 * @returns {Object|null} Error information or null if not found
 */
export function getErrorInfo(errorCode) {
  return VERCEL_ERRORS[errorCode] || null;
}

/**
 * Check if an error is a Vercel application error
 * @param {string} errorCode - The Vercel error code
 * @returns {boolean} True if it's an application error
 */
export function isApplicationError(errorCode) {
  return errorCode in APPLICATION_ERRORS;
}

/**
 * Check if an error is a Vercel platform error
 * @param {string} errorCode - The Vercel error code
 * @returns {boolean} True if it's a platform error
 */
export function isPlatformError(errorCode) {
  return errorCode in PLATFORM_ERRORS;
}

/**
 * Get user-friendly error message for a Vercel error
 * @param {string} errorCode - The Vercel error code
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(errorCode) {
  const errorInfo = getErrorInfo(errorCode);
  
  if (!errorInfo) {
    return 'An unknown error occurred.';
  }
  
  if (isPlatformError(errorCode)) {
    return `A platform error occurred (${errorCode}). Please contact Vercel support.`;
  }
  
  // Application-specific messages
  switch (errorCode) {
    case 'DEPLOYMENT_NOT_FOUND':
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
    case 'DEPLOYMENT_BLOCKED':
      return 'The deployment has been blocked.';
    case 'DEPLOYMENT_DISABLED':
      return 'The deployment is currently disabled.';
    case 'DEPLOYMENT_DELETED':
      return 'The deployment has been deleted.';
    case 'DEPLOYMENT_PAUSED':
      return 'The deployment is currently paused.';
    case 'INVALID_REQUEST_METHOD':
      return 'Invalid request method used.';
    case 'REQUEST_HEADER_TOO_LARGE':
      return 'The request header is too large.';
    case 'FUNCTION_PAYLOAD_TOO_LARGE':
      return 'The function payload is too large.';
    case 'URL_TOO_LONG':
      return 'The URL is too long.';
    case 'FUNCTION_INVOCATION_FAILED':
    case 'EDGE_FUNCTION_INVOCATION_FAILED':
    case 'MICROFRONTENDS_MIDDLEWARE_ERROR':
    case 'MIDDLEWARE_INVOCATION_FAILED':
      return 'An error occurred while processing your request.';
    case 'FUNCTION_INVOCATION_TIMEOUT':
    case 'EDGE_FUNCTION_INVOCATION_TIMEOUT':
    case 'MIDDLEWARE_INVOCATION_TIMEOUT':
      return 'The request timed out while processing.';
    default:
      return `An error occurred (${errorCode}).`;
  }
}

/**
 * Handle Vercel error based on error code
 * @param {string} errorCode - The Vercel error code
 * @param {Function} setErrorState - Function to set error state in component
 * @param {Function} setShowError - Function to show error UI
 */
export function handleVercelError(errorCode, setErrorState, setShowError) {
  const errorMessage = getErrorMessage(errorCode);
  const errorInfo = getErrorInfo(errorCode);
  
  // Set error state with detailed information
  if (setErrorState) {
    setErrorState({
      code: errorCode,
      message: errorMessage,
      status: errorInfo ? errorInfo.status : null,
      isPlatformError: isPlatformError(errorCode)
    });
  }
  
  // Show error UI if function provided
  if (setShowError) {
    setShowError(true);
  }
  
  // Log error for debugging
  console.error(`Vercel Error: ${errorCode}`, errorInfo);
  
  // Special handling for platform errors
  if (isPlatformError(errorCode)) {
    console.error('Platform errors should be reported to Vercel support.');
  }
}

export default {
  ERROR_CATEGORIES,
  APPLICATION_ERRORS,
  PLATFORM_ERRORS,
  VERCEL_ERRORS,
  getErrorInfo,
  isApplicationError,
  isPlatformError,
  getErrorMessage,
  handleVercelError
};