import React from 'react';
import { useParameterStore } from '../store/parameterStore';
import { useMappingStore } from '../store/mappingStore';
import { generateCombinations, combineWithImported } from '../utils/parameterUtils';

export const Preview: React.FC = () => {
  const { parameters, importedRows } = useParameterStore();
  const { mappings } = useMappingStore();

  if (!parameters.length) return null;

  const importedCount = importedRows?.[0]?.length || 0;
  const newParameters = parameters.slice(importedCount);
  
  let combinations = combineWithImported(importedRows, newParameters);
  
  if (!combinations?.length) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          No combinations available. Add values to your parameters.
        </p>
      </div>
    );
  }

  // Create parameter index mapping for validation
  const parameterIndexes = Object.fromEntries(
    parameters.map((param, index) => [param.id, index])
  );

  // Filter combinations based on mapping rules
  combinations = combinations.filter(combination => 
    mappings.every(mapping => {
      if (!mapping.applied) return true;

      const conditionsMet = mapping.conditions.every(condition => {
        if (!condition.sourceParam || !condition.sourceValue) return true;
        const paramIndex = parameterIndexes[condition.sourceParam];
        if (paramIndex === undefined) return true;
        
        const actualValue = combination[paramIndex];
        const isEqual = actualValue === condition.sourceValue;
        return condition.operator === 'equals' ? isEqual : !isEqual;
      });

      if (!conditionsMet) return true;

      return mapping.consequences.every(consequence => {
        if (!consequence.targetParam || !consequence.targetValue) return true;
        const paramIndex = parameterIndexes[consequence.targetParam];
        if (paramIndex === undefined) return true;
        
        const actualValue = combination[paramIndex];
        const isEqual = actualValue === consequence.targetValue;
        return consequence.operator === 'equals' ? isEqual : !isEqual;
      });
    })
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
              Description
            </th>
            {parameters.map((param) => (
              <th
                key={param.id}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-900"
              >
                {`${param.name}##${param.type}##${param.unit}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {combinations.map((combination, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                Row_{index + 1}
              </td>
              {combination.map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};