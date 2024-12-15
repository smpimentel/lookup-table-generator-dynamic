import { Parameter } from '../types/parameter';

/**
 * Generates all possible combinations from arrays of values
 */
export const generateCombinations = (arrays: string[][]): string[][] => {
  if (!arrays?.length) return [];
  if (arrays.some(arr => !Array.isArray(arr) || !arr.length)) return [];
  
  const [first, ...rest] = arrays;
  const restCombinations = generateCombinations(rest);
  
  if (restCombinations.length === 0) {
    return first.map(value => [value]);
  }
  
  return first.reduce((acc, x) => [...acc, ...restCombinations.map(c => [x, ...c])], []);
};

/**
 * Updates existing combinations when new parameter values are added
 */
export const updateParameterCombinations = (
  existingCombinations: string[][] | null,
  parameters: Parameter[],
  updatedParameterIndex: number
): string[][] => {
  if (!existingCombinations?.length) {
    return generateCombinations(parameters.map(p => p.values));
  }

  const updatedValues = parameters[updatedParameterIndex].values;
  const existingValues = new Set(
    existingCombinations.map(combo => combo[updatedParameterIndex])
  );

  // Find new values that weren't in existing combinations
  const newValues = updatedValues.filter(value => !existingValues.has(value));

  if (!newValues.length) {
    return existingCombinations;
  }

  // Generate combinations for other parameters
  const otherParameterValues = parameters
    .map(p => p.values)
    .filter((_, index) => index !== updatedParameterIndex);

  const otherCombinations = generateCombinations(otherParameterValues);

  // Generate new combinations with new values
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

  const newCombinations = generateCombinations(newParameters.map(p => p.values));
  
  return existingRows.flatMap(existingRow =>
    newCombinations.map(newCombo => [...existingRow, ...newCombo])
  );
};