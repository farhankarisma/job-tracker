'use client';

import { HiOutlineFolder } from 'react-icons/hi';
import FileCard from './FileCard';
import { FileItem } from '@/lib/features/file/fileSlice';

interface FileGridProps {
  files: FileItem[];
  onDownload: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onUpdate: (fileId: string, updates: { category?: string; description?: string; tags?: string }) => void;
  onFileUpload: (files: FileList) => void;
  hasFiles: boolean;
  formatFileSize: (bytes: number) => string;
}

export default function FileGrid({ 
  files, 
  onDownload, 
  onDelete, 
  onUpdate, 
  onFileUpload,
  hasFiles,
  formatFileSize
}: FileGridProps) {
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileUpload(event.target.files);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDownload={onDownload}
          onDelete={onDelete}
          onUpdate={onUpdate}
          formatFileSize={formatFileSize}
        />
      ))}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
          <HiOutlineFolder className="w-16 h-16 mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">
            {hasFiles ? 'No files match your search' : 'No files uploaded yet'}
          </h3>
          <p className="text-sm mb-4">
            {hasFiles ? 'Try adjusting your filters' : 'Upload your first document to get started'}
          </p>
          {!hasFiles && (
            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upload Files
              <input
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.xls,.xlsx"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
