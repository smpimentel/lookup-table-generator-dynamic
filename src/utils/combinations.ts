export const generateCombinations = <T>(arrays: T[][]): T[][] => {
  if (!arrays?.length) return [[]];
  if (arrays.some(arr => !Array.isArray(arr) || !arr.length)) return [];
  
  const [first, ...rest] = arrays;
  const restCombinations = generateCombinations(rest);
  return first.reduce((acc, x) => [...acc, ...restCombinations.map(c => [x, ...c])], []);
};

export const combineArrays = <T>(baseArrays: T[][], newArrays: T[][]): T[][] => {
  if (!baseArrays?.length) return generateCombinations(newArrays);
  if (!newArrays?.length) return baseArrays;

  const newCombinations = generateCombinations(newArrays);
  return baseArrays.flatMap(base => 
    newCombinations.map(combo => [...base, ...combo])
  );
};