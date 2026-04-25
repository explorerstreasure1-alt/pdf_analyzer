'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export default function AnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Spinner */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        
        {/* Spinning gradient ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/50 animate-spin"
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          />
        </div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-text">
          Analyzing with Groq Speed...
        </p>
        <p className="text-sm text-text-muted">
          Our AI is extracting insights from your document
        </p>
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-pulse-glow"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
