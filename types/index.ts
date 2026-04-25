export interface AnalysisResult {
  summary: string;
  keyInsights: string[];
  actionItems: string[];
}

export interface AnalysisError {
  message: string;
  code: string;
}

export interface UploadState {
  isUploading: boolean;
  isAnalyzing: boolean;
  error: AnalysisError | null;
  result: AnalysisResult | null;
}

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  maxSize?: number; // in bytes
}

export interface ResultsCardProps {
  result: AnalysisResult;
  isLoading?: boolean;
}

export interface AnalysisRequest {
  text: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: AnalysisError;
}

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
