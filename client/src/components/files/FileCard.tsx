'use client';

import { useState } from 'react';
import { HiOutlineDownload, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { FileItem } from '@/lib/features/file/fileSlice';
import toast from 'react-hot-toast';

interface FileCardProps {
  file: FileItem;
  onDownload: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onUpdate: (fileId: string, updates: { category?: string; description?: string; tags?: string }) => void;
  formatFileSize: (bytes: number) => string;
}

const categories = ['RESUME', 'COVER_LETTER', 'PORTFOLIO', 'CERTIFICATE', 'TRANSCRIPT', 'REFERENCE', 'OTHER'];

export default function FileCard({ file, onDownload, onDelete, onUpdate, formatFileSize }: FileCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
    return '📁';
  };

  const handleUpdate = (updates: { category?: string; description?: string; tags?: string }) => {
    onUpdate(file.id, updates);
    setIsEditing(false);
  };

  const handleDelete = () => {
    toast(
      (t) => {
        return (
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-gray-800">
              Delete file "{file.originalName}"?
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onDelete(file);
                  toast.success('File deleted successfully');
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        );
      },
      {
        icon: '🗑️',
        duration: Infinity,
        position: 'top-center',
        style: {
          minWidth: '350px',
          maxWidth: '400px',
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{getFileIcon(file.mimeType)}</div>
        <div className="flex gap-1">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <HiOutlinePencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDownload(file)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Download"
          >
            <HiOutlineDownload className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="font-medium text-gray-900 mb-2 truncate" title={file.originalName}>
        {file.originalName}
      </h3>
      
      <div className="text-sm text-gray-500 space-y-1">
        <p>{formatFileSize(file.size)}</p>
        <p className="capitalize">{file.category.replace('_', ' ').toLowerCase()}</p>
        <p>{new Date(file.createdAt).toLocaleDateString()}</p>
        {file.description && (
          <p className="text-xs text-gray-600 truncate">{file.description}</p>
        )}
        {file.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {file.tags.split(',').slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-4 pt-4 border-t space-y-3 text-black/55">
          <div>
            <label className="block text-xs font-medium mb-1">Category</label>
            <select
              defaultValue={file.category}
              onChange={(e) => handleUpdate({ category: e.target.value })}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Description</label>
            <input
              type="text"
              defaultValue={file.description || ''}
              onBlur={(e) => handleUpdate({ description: e.target.value })}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="File description..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Tags</label>
            <input
              type="text"
              defaultValue={file.tags || ''}
              onBlur={(e) => handleUpdate({ tags: e.target.value })}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="tag1, tag2, tag3..."
            />
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="w-full text-xs bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
