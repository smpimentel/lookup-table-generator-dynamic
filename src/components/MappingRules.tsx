import React from 'react';
import { Plus } from 'lucide-react';
import { useMappingStore } from '../store/mappingStore';
import { useParameterStore } from '../store/parameterStore';
import { MappingRule } from './MappingRule';

export const MappingRules: React.FC = () => {
  const { mappings, addMapping } = useMappingStore();
  const { parameters } = useParameterStore();

  if (parameters.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Parameter Mapping Rules</h2>
      <div className="space-y-4">
        {mappings.map((mapping) => (
          <MappingRule key={mapping.id} mapping={mapping} />
        ))}
      </div>
      <button
        onClick={addMapping}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus size={20} />
        Add Mapping Rule
      </button>
    </div>
  );
};