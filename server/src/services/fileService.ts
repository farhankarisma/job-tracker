import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

interface FileUploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
}

class FileService {
  private uploadDir: string;

  constructor() {
    // Create uploads directory if it doesn't exist
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Create subdirectories for different file types
    const subDirs = ['documents', 'images', 'temp'];
    subDirs.forEach(dir => {
      const subDirPath = path.join(this.uploadDir, dir);
      if (!fs.existsSync(subDirPath)) {
        fs.mkdirSync(subDirPath, { recursive: true });
      }
    });
  }

  async saveFile(
    buffer: Buffer, 
    originalName: string, 
    mimeType: string,
    userId: string
  ): Promise<FileUploadResult> {
    const fileExtension = path.extname(originalName);
    const filename = `${uuidv4()}${fileExtension}`;
    
    // Determine subdirectory based on file type
    const isImage = mimeType.startsWith('image/');
    const subDir = isImage ? 'images' : 'documents';
    const filePath = path.join(this.uploadDir, subDir, filename);
    
    try {
      // Optimize images before saving
      if (isImage && mimeType !== 'image/gif') {
        const optimizedBuffer = await sharp(buffer)
          .resize(2000, 2000, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toBuffer();
        
        fs.writeFileSync(filePath, optimizedBuffer);
      } else {
        fs.writeFileSync(filePath, buffer);
      }

      return {
        filename,
        originalName,
        mimeType,
        size: buffer.length,
        path: path.join(subDir, filename)
      };
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file');
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.uploadDir, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  getFileUrl(filename: string): string {
    return `/api/files/download/${filename}`;
  }

  validateFile(file: Express.Multer.File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return { isValid: false, error: 'File type not supported' };
    }

    return { isValid: true };
  }
}

export default new FileService();
