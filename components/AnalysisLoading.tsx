'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/i18n';

interface AnalysisLoadingProps {
  message?: string;
}

export default function AnalysisLoading({ message = 'Analyzing with Groq Speed...' }: AnalysisLoadingProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-surface/50 backdrop-blur-md border border-primary/30 rounded-2xl p-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="relative p-6 bg-primary/10 rounded-full">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <p className="text-text text-lg font-medium">{message}</p>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <p className="text-text-muted text-sm">
              Extracting insights and generating action items
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
