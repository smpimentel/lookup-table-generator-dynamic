import { Parameter } from '../types/parameter';

/**
 * Generates all possible combinations from arrays of values
 * @param arrays Array of string arrays to combine
 * @returns Array of all possible combinations
 */
export const generateCombinations = (arrays: string[][]): string[][] => {
  // Handle edge cases
  if (!arrays?.length) return [];
  if (arrays.some(arr => !Array.isArray(arr) || !arr.length)) return [];

  // Base case: single array
  if (arrays.length === 1) {
    return arrays[0].map(value => [value]);
  }

  // Recursive combination generation
  const result: string[][] = [];
  const [currentArray, ...remainingArrays] = arrays;
  const subCombinations = generateCombinations(remainingArrays);

  for (const value of currentArray) {
    for (const subCombo of subCombinations) {
      result.push([value, ...subCombo]);
    }
  }

  return result;
};

/**
 * Updates existing combinations when parameter values change
 * @param existingCombinations Current combinations
 * @param parameters All parameters
 * @param updatedParameterIndex Index of the modified parameter
 * @returns Updated combinations array
 */
export const updateParameterCombinations = (
  existingCombinations: string[][] | null,
  parameters: Parameter[],
  updatedParameterIndex: number
): string[][] => {
  // Generate new combinations if none exist
  if (!existingCombinations?.length) {
    return generateCombinations(parameters.map(p => p.values));
  }

  const updatedValues = parameters[updatedParameterIndex].values;
  const existingValues = new Set(
    existingCombinations.map(combo => combo[updatedParameterIndex])
  );

  const newValues = updatedValues.filter(value => !existingValues.has(value));
  if (!newValues.length) {
    return existingCombinations;
  }

  const otherParameterValues = parameters
    .map(p => p.values)
    .filter((_, index) => index !== updatedParameterIndex);

  const otherCombinations = generateCombinations(otherParameterValues);

  const newCombinations = newValues.flatMap(newValue => 
    otherCombinations.map(combo => {
      const result = [...combo];
      result.splice(updatedParameterIndex, 0, newValue);
      return result;
    })
  );

  return [...existingCombinations, ...newCombinations];
};

/**
 * Combines imported rows with new parameter combinations
 * @param existingRows Previously imported rows
 * @param newParameters New parameters to combine
 * @returns Combined array of all combinations
 */
export const combineWithImported = (
  existingRows: string[][],
  newParameters: Parameter[]
): string[][] => {
  if (!existingRows?.length) {
    return generateCombinations(newParameters.map(p => p.values));
  }

  if (!newParameters?.length) {
    return existingRows;
  }

  const newValues = newParameters.map(p => p.values);
  const newCombinations = generateCombinations(newValues);

  return existingRows.flatMap(existingRow =>
    newCombinations.map(newCombo => [...existingRow, ...newCombo])
  );
};