// API Configuration for different environments
export const API_CONFIG = {
  // Use environment variable if available, fallback to Railway production URL
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://job-tracker-production-5883.up.railway.app',
  
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

// Debug logging
console.log('API_BASE_URL:', API_BASE_URL);

// Validate URL format
if (!API_BASE_URL.startsWith('http')) {
  console.error('Invalid API_BASE_URL:', API_BASE_URL);
}
