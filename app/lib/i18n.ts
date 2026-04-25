export const translations: { [key: string]: string } = {
  pdf_header: 'PDF Analyzer',
};

export const t = (key: string): string => translations[key] ?? key;
