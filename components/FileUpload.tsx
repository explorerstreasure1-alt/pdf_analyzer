'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/i18n';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isProcessing: boolean;
}

export default function FileUpload({
  onFileSelect,
  selectedFile,
  onClearFile,
  isProcessing,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing || selectedFile !== null,
  });

  if (selectedFile) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-surface/50 backdrop-blur-md border border-primary/30 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-text font-medium">{selectedFile.name}</p>
              <p className="text-text-muted text-sm">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClearFile}
              className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-muted hover:text-primary" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          'relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300',
          'bg-surface/30 backdrop-blur-md',
          isDragActive && !isDragReject && 'border-primary bg-primary/10 scale-[1.02]',
          isDragReject && 'border-red-500 bg-red-500/10',
          !isDragActive && 'border-border hover:border-primary/50 hover:bg-surface/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            'p-6 rounded-2xl transition-all duration-300',
            'bg-surface/50 backdrop-blur-sm',
            isDragActive && 'bg-primary/20 scale-110'
          )}>
            <Upload className={cn(
              'w-12 h-12 transition-colors',
              isDragActive ? 'text-primary' : 'text-text-muted group-hover:text-primary'
            )} />
          </div>
          <div className="space-y-2">
            <p className="text-text text-lg font-medium">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
            </p>
            <p className="text-text-muted text-sm">
              or click to browse files
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="px-2 py-1 bg-surface/50 rounded-full border border-border">
              PDF only
            </span>
            <span className="px-2 py-1 bg-surface/50 rounded-full border border-border">
              Max 10MB
            </span>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
