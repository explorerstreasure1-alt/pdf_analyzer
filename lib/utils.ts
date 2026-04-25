import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateFile(file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Only PDF files are supported' };
  }

  // Check file size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size exceeds ${formatFileSize(maxSize)} limit` 
    };
  }

  return { valid: true };
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => resolve(true)).catch(() => resolve(false));
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        resolve(successful);
      } catch (err) {
        resolve(false);
      } finally {
        textArea.remove();
      }
    }
  });
}

export function formatAnalysisResult(result: { summary: string; keyInsights: string[]; actionItems: string[] }): string {
  return `
SUMMARY
${result.summary}

KEY INSIGHTS
${result.keyInsights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

ACTION ITEMS
${result.actionItems.map((item, i) => `[ ] ${i + 1}. ${item}`).join('\n')}
  `.trim();
}
