import { Parameter } from '../types/parameter';
import { generateCombinations } from './combinationUtils';

/**
 * Formats parameter data into CSV format
 * @param parameters Array of parameters to format
 * @returns CSV string with headers and all possible combinations
 */
export const formatCSV = (parameters: Parameter[]): string => {
  // Generate CSV headers with parameter metadata
  const headers = [
    'Description', 
    ...parameters.map(p => `${p.name}##${p.type}##${p.unit}`)
  ];

  // Extract parameter values for combination generation
  const values = parameters.map(p => p.values);
  
  // Generate all possible combinations
  const combinations = generateCombinations(values);
  
  // Create rows with description and values
  const rows = combinations.map((row, index) => [`Row_${index + 1}`, ...row]);
  
  // Join everything into CSV format
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};