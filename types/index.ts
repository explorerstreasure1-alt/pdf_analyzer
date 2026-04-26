export interface AnalysisResult {
  summary: string;
  insights: string[];
  actionItems: string[];
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export interface FileUploadError {
  message: string;
  code?: string;
}
