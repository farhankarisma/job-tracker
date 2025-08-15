'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/src/supabaseClient'; 
import type { Session } from '@supabase/supabase-js';
import Sidebar from '@/components/Sidebar';
import FileUploadZone from '@/components/files/FileUploadZone';
import FileFilters from '@/components/files/FileFilters';
import FileGrid from '@/components/files/FileGrid';
import { useFiles } from '@/hooks/useFiles';

export default function FileStorePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side before accessing localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getAuthToken = () => {
    // Check if we're in the browser (client-side)
    if (typeof window !== 'undefined' && isClient) {
      return localStorage.getItem('authToken') || session?.access_token || null;
    }
    // On server-side, only use session token
    return session?.access_token || null;
  };

  const {
    filteredFiles,
    loading,
    uploadingFiles,
    error,
    filters,
    filesCount,
    totalSize,
    loadFiles,
    uploadFiles,
    downloadFile,
    deleteFile,
    updateFile,
    setCategory,
    setSearchTerm,
    clearError,
    formatFileSize,
  } = useFiles(getAuthToken());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
        setIsLoading(false);
        // Only load files after session is established and we're on client side
        if (typeof window !== 'undefined' && isClient) {
          loadFiles();
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const token = getAuthToken();
    if (token && typeof window !== 'undefined' && isClient) {
      loadFiles(filters.category, filters.searchTerm);
    }
  }, [filters.category, filters.searchTerm, session, isClient]); // Add session and isClient as dependencies

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleFileUpload = async (fileList: FileList) => {
    await uploadFiles(fileList, 'OTHER');
    loadFiles(); // Refresh the list after upload
  };

  const handleDownload = async (file: any) => {
    await downloadFile(file);
  };

  const handleDelete = async (file: any) => {
    await deleteFile(file.id);
  };

  const handleUpdate = async (fileId: string, updates: any) => {
    await updateFile(fileId, updates);
  };

  useEffect(() => {
    if (error) {
      console.error('File operation error:', error);
      // Optionally show a toast notification
      setTimeout(() => clearError(), 5000);
    }
  }, [error, clearError]);

  if (isLoading || !session || !isClient) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar 
        userEmail={session.user.email}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-8">
          {/* Header with Stats */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">File Store</h1>
                <p className="text-gray-600 mt-1">Store and manage your documents</p>
              </div>
              
              {/* File Stats */}
              <div className="flex gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-semibold text-lg">{filesCount}</div>
                  <div>Files</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{formatFileSize(totalSize)}</div>
                  <div>Total Size</div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-red-700">{error}</span>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <FileUploadZone
            onFileUpload={handleFileUpload}
            isUploading={uploadingFiles.length > 0}
            uploadingFiles={uploadingFiles}
          />

          <FileFilters
            selectedCategory={filters.category}
            searchTerm={filters.searchTerm}
            onCategoryChange={setCategory}
            onSearchChange={setSearchTerm}
          />

          {loading ? (
            <div className="text-center py-8">Loading files...</div>
          ) : (
            <FileGrid
              files={filteredFiles}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onFileUpload={handleFileUpload}
              hasFiles={filteredFiles.length > 0}
              formatFileSize={formatFileSize}
            />
          )}
        </div>
      </div>
    </div>
  );
}
