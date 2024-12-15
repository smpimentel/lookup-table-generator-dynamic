import { Parameter } from '../types/parameter';
import { generateCombinations } from './combinationUtils';

export const generateCSV = (parameters: Parameter[]): string => {
  const headers = ['Description', ...parameters.map(p => `${p.name}##${p.type}##${p.unit}`)];
  const values = parameters.map(p => p.values);
  const combinations = generateCombinations(values);
  const rows = combinations.map((row, index) => [`Row_${index + 1}`, ...row]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

export const downloadFile = (content: string, filename: string, type = 'text/plain'): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};