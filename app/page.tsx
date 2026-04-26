'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultsCard from '@/components/ResultsCard';
import AnalysisLoading from '@/components/AnalysisLoading';
import { AnalysisResult } from '@/types';
import { Sparkles, FileText, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);
    setRetryCount(0);
    setIsProcessing(true);

    await analyzeFile(file);
  };

  const analyzeFile = async (file: File, attempt = 1) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // 65s timeout (slightly more than API maxDuration)

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.data);
      setRetryCount(0);
    } catch (err) {
      clearTimeout(timeoutId);

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      // Retry on network errors or timeouts (up to 2 retries)
      if (attempt < 3 && (errorMessage.includes('fetch') || errorMessage.includes('timeout') || errorMessage.includes('AbortError'))) {
        setRetryCount(attempt);
        setIsRetrying(true);

        // Exponential backoff: 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        setIsRetrying(false);
        await analyzeFile(file, attempt + 1);
        return;
      }

      setError(errorMessage);
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
      setIsRetrying(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-text">
              DeepPDF<span className="text-primary">.net</span>
            </h1>
          </div>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Transform your PDF documents into actionable insights with AI-powered analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {!result && !isProcessing && (
            <>
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClearFile={handleClearFile}
                isProcessing={isProcessing}
              />

              {error && (
                <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400 text-center animate-in fade-in">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Analysis Failed</span>
                  </div>
                  <p className="text-sm mb-4">{error}</p>
                  {retryCount > 0 && (
                    <p className="text-xs text-red-300 mb-4">
                      Attempted {retryCount} {retryCount === 1 ? 'retry' : 'retries'}
                    </p>
                  )}
                  <button
                    onClick={() => selectedFile && handleFileSelect(selectedFile)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg transition-colors flex items-center gap-2 mx-auto text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              )}

              {selectedFile && !isProcessing && (
                <div className="max-w-2xl mx-auto text-center">
                  <button
                    onClick={handleFileSelect}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-background font-semibold rounded-xl transition-colors duration-200"
                  >
                    Analyze PDF
                  </button>
                </div>
              )}
            </>
          )}

          {isProcessing && <AnalysisLoading message={isRetrying ? `Retrying... (Attempt ${retryCount + 1}/3)` : 'Analyzing with Groq Speed...'} />}

          {result && !isProcessing && (
            <div className="space-y-6">
              <ResultsCard result={result} />

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-surface hover:bg-surface/80 border border-border text-text rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  <FileText className="w-4 h-4" />
                  Analyze Another PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-text-muted text-sm">
          <p>Powered by Groq & Llama 3.1-70B-Versatile</p>
        </footer>
      </div>
    </main>
  );
}
