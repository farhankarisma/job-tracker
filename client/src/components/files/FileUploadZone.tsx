'use client';

import { useState } from 'react';
import { HiOutlineUpload } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface FileUploadZoneProps {
  onFileUpload: (files: FileList) => void;
  isUploading: boolean;
  uploadingFiles: string[];
}

export default function FileUploadZone({ onFileUpload, isUploading, uploadingFiles }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  // File validation settings
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = [
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.xls', '.xlsx', '.csv',
    '.ppt', '.pptx'
  ];

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (too large - max 10MB)`);
        return;
      }

      // Check file extension
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        invalidFiles.push(`${file.name} (unsupported format)`);
        return;
      }

      validFiles.push(file);
    });

    // Show error toast for invalid files
    if (invalidFiles.length > 0) {
      toast.error(
        `Cannot upload: ${invalidFiles.join(', ')}`,
        { duration: 6000 }
      );
    }

    return validFiles;
  };

  const processFiles = (files: FileList) => {
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      // Create a new FileList-like object with only valid files
      const dt = new DataTransfer();
      validFiles.forEach(file => dt.items.add(file));
      onFileUpload(dt.files);
      
      if (validFiles.length < files.length) {
        toast.success(`${validFiles.length} valid file(s) will be uploaded`);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(event.target.files);
      // Reset the input value so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  return (
    <>
      {/* Upload Button */}
      <div className="flex justify-end mb-6">
        <label className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2">
          <HiOutlineUpload className="w-4 h-4" />
          Upload Files
          <input
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.zip,.rar,.7z,.tar,.gz,.xls,.xlsx,.csv,.ppt,.pptx"
          />
        </label>
      </div>

      {/* Drop Zone */}
      <div
        className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <HiOutlineUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or click the upload button above
        </p>
        <p className="text-sm text-gray-500">
          Documents, Images, Archives (max 10MB each)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supported: PDF, Word, Excel, PowerPoint, Images, ZIP/RAR
        </p>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Uploading Files</h3>
          {uploadingFiles.map((fileName, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm text-blue-700">{fileName}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
