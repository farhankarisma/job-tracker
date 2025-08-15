import { uploadToCloudinary } from '../services/cloudinaryService';

// Single file upload using Cloudinary
export const uploadSingleCloudinary = uploadToCloudinary.single('file');

// Multiple file upload using Cloudinary  
export const uploadMultipleCloudinary = uploadToCloudinary.array('files', 5);

// Keep original middleware as fallback (for local development)
export { uploadSingle, uploadMultiple } from './uploadMiddleware';
