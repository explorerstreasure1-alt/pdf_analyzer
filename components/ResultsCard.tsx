'use client';

import React from 'react';
import { Copy, Check, Sparkles, Lightbulb, Target, FileText } from 'lucide-react';
import { ResultsCardProps } from '@/types';
import { copyToClipboard, formatAnalysisResult } from '@/lib/utils';

export default function ResultsCard({ result, isLoading = false }: ResultsCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const formattedText = formatAnalysisResult(result);
    const success = await copyToClipboard(formattedText);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-surface-light">
        {/* Shimmer Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-24 bg-surface-light rounded animate-pulse" />
            <div className="h-6 w-full bg-surface-light rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-surface-light rounded animate-pulse" />
          </div>

          {/* Key Insights Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-32 bg-surface-light rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-full bg-surface-light rounded animate-pulse" style={{ width: `${90 - i * 5}%` }} />
              ))}
            </div>
          </div>

          {/* Action Items Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-28 bg-surface-light rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-full bg-surface-light rounded animate-pulse" style={{ width: `${85 - i * 3}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface border border-surface-light shadow-2xl">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-surface-light">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text">Analysis Results</h3>
        </div>
        
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${copied 
              ? 'bg-success/20 text-success' 
              : 'bg-surface-light text-text hover:bg-primary/20 hover:text-primary'
            }
          `}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative p-6 space-y-8">
        {/* Summary Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Summary</h4>
          </div>
          <p className="text-text leading-relaxed pl-6 border-l-2 border-primary/30">
            {result.summary}
          </p>
        </section>

        {/* Key Insights Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Key Insights</h4>
          </div>
          <ul className="space-y-3 pl-6 border-l-2 border-primary/30">
            {result.keyInsights.map((insight, index) => (
              <li 
                key={index} 
                className="flex gap-3 text-text"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Action Items Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Action Items</h4>
          </div>
          <ul className="space-y-3 pl-6 border-l-2 border-primary/30">
            {result.actionItems.map((item, index) => (
              <li 
                key={index} 
                className="flex gap-3 text-text"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded border-2 border-primary/40 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
