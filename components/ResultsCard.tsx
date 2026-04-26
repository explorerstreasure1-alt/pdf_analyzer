'use client';

import { useState } from 'react';
import { Check, Copy, CheckCircle, Lightbulb, ListTodo } from 'lucide-react';
import { AnalysisResult } from '@/types';
// FIX #1: Removed unused 'cn' import - it was not used in this component

interface ResultsCardProps {
  result: AnalysisResult;
  isLoading?: boolean;
}

export default function ResultsCard({ result, isLoading }: ResultsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `
Summary: ${result.summary}

Key Insights:
${result.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

Action Items:
${result.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}
    `.trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="bg-surface/50 backdrop-blur-md border border-border rounded-2xl p-8 overflow-hidden">
          <div className="animate-shimmer bg-gradient-to-r from-surface via-surface/50 to-surface bg-[length:1000px_100%]">
            <div className="space-y-4">
              <div className="h-6 bg-surface/30 rounded w-3/4" />
              <div className="h-4 bg-surface/30 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Section */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-primary/20 rounded-lg transition-colors group"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-primary" />
            ) : (
              <Copy className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            )}
          </button>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-text text-lg font-semibold mb-2">Summary</h3>
            <p className="text-text-muted leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-text text-lg font-semibold">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {result.insights.map((insight, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-text-muted leading-relaxed"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                {index + 1}
              </span>
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Items Section */}
      <div className="bg-surface/50 backdrop-blur-md border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/20 rounded-lg">
            <ListTodo className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-text text-lg font-semibold">Action Items</h3>
        </div>
        <ul className="space-y-3">
          {result.actionItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-text-muted leading-relaxed"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
