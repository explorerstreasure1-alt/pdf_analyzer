'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { t } from '@/lib/i18n';
import { FileText, Sparkles, Zap, AlertCircle, RotateCcw, CreditCard, X } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import AnalysisLoading from '@/components/AnalysisLoading';
import ResultsCard from '@/components/ResultsCard';
import { AnalysisResult, AnalysisError } from '@/types';

const PAYMENT_URL = 'https://projeai.lemonsqueezy.com/checkout/buy/edea2ac0-c5be-4708-a7c4-a1df1a64308b';
const MAX_FREE_ATTEMPTS = 3;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Load attempts from localStorage on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem('pdfAnalyzerAttempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts, 10));
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    // Check if user has exceeded free attempts
    if (attempts >= MAX_FREE_ATTEMPTS) {
      setShowPaymentModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Analysis failed');
      }

      setResult(data.data);

      // Increment attempts on successful analysis
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('pdfAnalyzerAttempts', newAttempts.toString());

      // Show payment modal after reaching limit
      if (newAttempts >= MAX_FREE_ATTEMPTS) {
        setTimeout(() => setShowPaymentModal(true), 2000);
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        code: 'ANALYSIS_ERROR',
      });
    } finally {
      setIsLoading(false);
    }
  }, [attempts]);

  const handleReset = () => {
    setError(null);
    setResult(null);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-surface via-background to-background opacity-50" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">{t('pdf_header')}</span>
          </h1>

          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-4">
            Transform your documents into actionable insights. Upload a PDF and get AI-powered
            summaries, key insights, and action items in seconds.
          </p>

          {/* Attempts Counter */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-surface-light text-sm">
            <span className="text-text-muted">Free attempts:</span>
            <span className="font-semibold text-primary">
              {attempts}/{MAX_FREE_ATTEMPTS}
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="rounded-3xl bg-surface/50 backdrop-blur-sm border border-surface-light p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Feature Badges */}
          {!result && !isLoading && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: FileText, label: 'PDF Support' },
                { icon: Sparkles, label: 'AI Summary' },
                { icon: Zap, label: 'Lightning Fast' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-surface-light text-sm text-text-muted"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  {feature.label}
                </div>
              ))}
            </div>
          )}

          {/* Error Display */}
          {error && !isLoading && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-error/10 border border-error/30 p-4">
              <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-error mb-1">Analysis Failed</p>
                <p className="text-sm text-text-muted">{error.message}</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-light text-sm text-text hover:text-primary transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}

          {/* File Upload or Loading */}
          {!result ? (
            isLoading ? (
              <AnalysisLoading />
            ) : (
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                maxSize={10 * 1024 * 1024}
              />
            )
          ) : (
            /* Results */
            <div className="space-y-6">
              <ResultsCard
                result={result}
                isLoading={false}
              />

              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-light text-text hover:bg-primary/20 hover:text-primary transition-all duration-200 font-medium"
                >
                  <RotateCcw className="h-4 w-4" />
                  Analyze Another Document
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-text-muted">
            Powered by{' '}
            <a
              href="https://groq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Groq
            </a>{' '}
            and{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Next.js
            </a>
          </p>
        </footer>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Upgrade Required</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CreditCard className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Free Limit Reached</p>
                  <p className="text-sm text-gray-600">
                    You've used your {MAX_FREE_ATTEMPTS} free analyses. Upgrade to continue using PDF Analyzer with unlimited access.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Your current usage:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{attempts}/{MAX_FREE_ATTEMPTS}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <CreditCard className="h-5 w-5" />
                Upgrade Now
              </a>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
