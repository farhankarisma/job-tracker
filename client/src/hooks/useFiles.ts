import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import {
  fetchFiles,
  uploadFile,
  uploadMultipleFiles,
  downloadFile,
  updateFile,
  deleteFile,
  setFilter,
  clearError,
  selectFiles,
  selectFilteredFiles,
  selectFilesLoading,
  selectUploadingFiles,
  selectFilesError,
  selectFilters,
  selectUploadProgress,
  selectFilesCount,
  selectFilesSizeTotal,
  FileItem,
} from '@/lib/features/file/fileSlice';

export function useFiles(token: string | null) {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const files = useSelector(selectFiles);
  const filteredFiles = useSelector(selectFilteredFiles);
  const loading = useSelector(selectFilesLoading);
  const uploadingFiles = useSelector(selectUploadingFiles);
  const error = useSelector(selectFilesError);
  const filters = useSelector(selectFilters);
  const uploadProgress = useSelector(selectUploadProgress);
  const filesCount = useSelector(selectFilesCount);
  const totalSize = useSelector(selectFilesSizeTotal);

  // Actions
  const loadFiles = useCallback((category?: string, search?: string) => {
    if (!token) return Promise.resolve();
    return dispatch(fetchFiles({ token, category, search }));
  }, [dispatch, token]);

  const uploadSingleFile = useCallback((file: File, category?: string) => {
    if (!token) return;
    return dispatch(uploadFile({ token, file, category }));
  }, [dispatch, token]);

  const uploadFiles = useCallback((fileList: FileList | File[], category?: string) => {
    if (!token) return;
    const files = Array.from(fileList);
    return dispatch(uploadMultipleFiles({ token, files, category }));
  }, [dispatch, token]);

  const downloadFileAction = useCallback((file: FileItem) => {
    if (!token) return;
    return dispatch(downloadFile({ token, file }));
  }, [dispatch, token]);

  const updateFileAction = useCallback((fileId: string, updates: { category?: string; description?: string; tags?: string }) => {
    if (!token) return;
    return dispatch(updateFile({ token, fileId, updates }));
  }, [dispatch, token]);

  const deleteFileAction = useCallback((fileId: string) => {
    if (!token) return;
    return dispatch(deleteFile({ token, fileId }));
  }, [dispatch, token]);

  const setCategory = useCallback((category: string) => {
    dispatch(setFilter({ type: 'category', value: category }));
  }, [dispatch]);

  const setSearchTerm = useCallback((search: string) => {
    dispatch(setFilter({ type: 'search', value: search }));
  }, [dispatch]);

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    // State
    files,
    filteredFiles,
    loading,
    uploadingFiles,
    error,
    filters,
    uploadProgress,
    filesCount,
    totalSize,
    
    // Actions
    loadFiles,
    uploadSingleFile,
    uploadFiles,
    downloadFile: downloadFileAction,
    updateFile: updateFileAction,
    deleteFile: deleteFileAction,
    setCategory,
    setSearchTerm,
    clearError: clearErrorAction,
    
    // Utilities
    formatFileSize,
  };
}
