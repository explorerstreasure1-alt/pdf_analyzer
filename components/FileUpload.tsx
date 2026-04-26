'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, FileText, X, AlertCircle } from 'lucide-react';
import { FileUploadProps } from '@/types';
import { formatFileSize, validateFile } from '@/lib/utils';

export default function FileUpload({
  onFileSelect,
  isLoading = false,
  maxSize = 10 * 1024 * 1024 // 10MB default
}: FileUploadProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // FIX #10: Use proper FileRejection type from react-dropzone
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File size exceeds ${formatFileSize(maxSize)} limit`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Only PDF files are supported');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validation = validateFile(file, maxSize);

      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [maxSize, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize,
    multiple: false,
    disabled: isLoading,
  });

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Error Message */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-error">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Dropzone */}
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer
            ${isDragActive && !isDragReject
              ? 'border-primary bg-primary/10'
              : 'border-text-muted/30 bg-glass backdrop-blur-md'
            }
            ${isDragReject ? 'border-error bg-error/10' : ''}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/60 hover:bg-primary/5'}
          `}
        >
          <input {...getInputProps()} />

          {/* Shimmer Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                ${isDragActive ? 'animate-shimmer' : ''}
              `}
            />
          </div>

          <div className="relative flex flex-col items-center gap-4">
            <div className={`
              rounded-full p-4 transition-transform duration-300
              ${isDragActive ? 'scale-110 bg-primary/20' : 'bg-surface-light'}
            `}>
              <FileUp className={`
                h-8 w-8 transition-colors duration-300
                ${isDragActive ? 'text-primary' : 'text-primary/70'}
              `} />
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-text mb-1">
                {isDragActive ? 'Drop your PDF here' : 'Drop your PDF here, or click to browse'}
              </p>
              <p className="text-sm text-text-muted">
                PDF files only, max {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Display */
        <div className="rounded-2xl border border-primary/30 bg-surface p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text truncate max-w-[200px] sm:max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-text-muted">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {!isLoading && (
              <button
                onClick={clearFile}
                className="rounded-lg p-2 text-text-muted hover:bg-surface-light hover:text-error transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
