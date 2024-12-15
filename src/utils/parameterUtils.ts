import { Parameter } from '../types/parameter';
import { generateCombinations } from './combinationUtils';

export const formatCSV = (parameters: Parameter[]): string => {
  const headers = ['Description', ...parameters.map(p => `${p.name}##${p.type}##${p.unit}`)];
  const values = parameters.map(p => p.values);
  const combinations = generateCombinations(values);
  const rows = combinations.map((row, index) => [`Row_${index + 1}`, ...row]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};