import { Parameter } from '../types/parameter';

export const generateCombinations = (arrays: string[][]): string[][] => {
  if (!arrays?.length) return [[]];
  if (arrays.some(arr => !Array.isArray(arr) || !arr.length)) return [];
  
  const [first, ...rest] = arrays;
  const restCombinations = generateCombinations(rest);
  return first.reduce((acc, x) => [...acc, ...restCombinations.map(c => [x, ...c])], []);
};

export const combineWithImported = (
  importedRows: string[][] | null,
  parameters: Parameter[]
): string[][] => {
  if (!importedRows?.length) {
    const values = parameters.map(p => p.values);
    return generateCombinations(values);
  }

  const newValues = parameters.map(p => p.values);
  const newCombinations = generateCombinations(newValues);
  
  return newCombinations.length ? 
    importedRows.flatMap(row => newCombinations.map(combo => [...row, ...combo])) :
    importedRows;
};

export const formatCSV = (parameters: Parameter[]): string => {
  const headers = ['Description', ...parameters.map(p => `${p.name}##${p.type}##${p.unit}`)];
  const values = parameters.map(p => p.values);
  const combinations = generateCombinations(values);
  const rows = combinations.map((row, index) => [`Row_${index + 1}`, ...row]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};