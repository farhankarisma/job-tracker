// API Configuration for different environments
export const API_CONFIG = {
  // Use environment variable if available, fallback to localhost for development
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '${API_BASE_URL}',
  
  // API endpoints
  endpoints: {
    jobs: '/api/jobs',
    files: '/api/files',
    auth: '/api/auth',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export the base URL for direct use
export const API_BASE_URL = API_CONFIG.BASE_URL;
