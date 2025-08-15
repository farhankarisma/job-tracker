'use client';

import { useState } from 'react';
import { HiOutlineUpload } from 'react-icons/hi';

interface FileUploadZoneProps {
  onFileUpload: (files: FileList) => void;
  isUploading: boolean;
  uploadingFiles: string[];
}

export default function FileUploadZone({ onFileUpload, isUploading, uploadingFiles }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

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
      onFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileUpload(event.target.files);
    }
  };

  return (
    <>
      {/* Upload Button */}
      <div className="flex justify-end mb-6">
        <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg flex items-center gap-2">
          <HiOutlineUpload className="w-4 h-4" />
          Upload Files
          <input
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.xls,.xlsx"
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
          PDF, Word, Excel, Images (max 10MB each)
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
