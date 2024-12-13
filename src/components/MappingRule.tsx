import React from 'react';
import { Trash2 } from 'lucide-react';
import { MappingRule as IMappingRule } from '../types/mapping';
import { useMappingStore } from '../store/mappingStore';
import { useParameterStore } from '../store/parameterStore';
import { Condition } from './Condition';
import { Consequence } from './Consequence';

interface Props {
  mapping: IMappingRule;
}

export const MappingRule: React.FC<Props> = ({ mapping }) => {
  const { removeMapping, updateMapping } = useMappingStore();
  const { parameters } = useParameterStore();

  const handleAddCondition = () => {
    const updatedMapping = {
      ...mapping,
      conditions: [
        ...mapping.conditions,
        { sourceParam: '', operator: 'equals', sourceValue: '' }
      ],
      applied: false
    };
    updateMapping(mapping.id, updatedMapping);
  };

  const handleAddConsequence = () => {
    const updatedMapping = {
      ...mapping,
      consequences: [
        ...mapping.consequences,
        { targetParam: '', operator: 'equals', targetValue: '' }
      ],
      applied: false
    };
    updateMapping(mapping.id, updatedMapping);
  };

  const isValid = mapping.conditions.length > 0 && 
                 mapping.consequences.length > 0 &&
                 mapping.conditions.every(c => c.sourceParam && c.sourceValue) &&
                 mapping.consequences.every(c => c.targetParam && c.targetValue);

  return (
    <div className={`p-4 border rounded-lg ${
      mapping.applied ? 'bg-green-50' : (isValid ? 'bg-blue-50' : 'bg-red-50')
    }`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Mapping Rule</h3>
          <span className={`text-sm ${
            mapping.applied ? 'text-green-600' : (isValid ? 'text-blue-600' : 'text-red-600')
          }`}>
            {mapping.applied ? '✓ Applied' : (isValid ? 'Ready to apply' : 'Incomplete rule')}
          </span>
        </div>
        <div className="flex gap-2">
          {isValid && (
            <button
              onClick={() => updateMapping(mapping.id, { ...mapping, applied: true })}
              className={`px-3 py-1 ${
                mapping.applied ? 'bg-blue-600' : 'bg-green-600'
              } text-white rounded hover:opacity-90`}
            >
              {mapping.applied ? 'Update Rule' : 'Apply Rule'}
            </button>
          )}
          <button
            onClick={() => removeMapping(mapping.id)}
            className="text-red-600 hover:bg-red-100 p-1 rounded"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          If this condition is true:
        </label>
        <div className="space-y-2">
          {mapping.conditions.map((condition, index) => (
            <Condition
              key={index}
              condition={condition}
              parameters={parameters}
              onUpdate={(updates) => {
                const newConditions = [...mapping.conditions];
                newConditions[index] = { ...condition, ...updates };
                updateMapping(mapping.id, {
                  ...mapping,
                  conditions: newConditions,
                  applied: false
                });
              }}
              onRemove={() => {
                const newConditions = mapping.conditions.filter((_, i) => i !== index);
                updateMapping(mapping.id, {
                  ...mapping,
                  conditions: newConditions,
                  applied: false
                });
              }}
            />
          ))}
          <button
            onClick={handleAddCondition}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            + Add Condition
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Then this must also be true:
        </label>
        <div className="space-y-2">
          {mapping.consequences.map((consequence, index) => (
            <Consequence
              key={index}
              consequence={consequence}
              parameters={parameters}
              onUpdate={(updates) => {
                const newConsequences = [...mapping.consequences];
                newConsequences[index] = { ...consequence, ...updates };
                updateMapping(mapping.id, {
                  ...mapping,
                  consequences: newConsequences,
                  applied: false
                });
              }}
              onRemove={() => {
                const newConsequences = mapping.consequences.filter((_, i) => i !== index);
                updateMapping(mapping.id, {
                  ...mapping,
                  consequences: newConsequences,
                  applied: false
                });
              }}
            />
          ))}
          <button
            onClick={handleAddConsequence}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            + Add Requirement
          </button>
        </div>
      </div>
    </div>
  );
};