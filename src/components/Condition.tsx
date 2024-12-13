import React from 'react';
import { Trash2 } from 'lucide-react';
import { Condition as ICondition } from '../types/mapping';
import { Parameter } from '../types/parameter';

interface Props {
  condition: ICondition;
  parameters: Parameter[];
  onUpdate: (updates: Partial<ICondition>) => void;
  onRemove: () => void;
}

export const Condition: React.FC<Props> = ({
  condition,
  parameters,
  onUpdate,
  onRemove,
}) => {
  const selectedParam = parameters.find(p => p.id === condition.sourceParam);

  return (
    <div className="flex gap-2 items-center">
      <select
        value={condition.sourceParam}
        onChange={(e) => onUpdate({ sourceParam: e.target.value, sourceValue: '' })}
        className="flex-1 px-3 py-2 border rounded-md"
      >
        <option value="">Select Parameter</option>
        {parameters.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select
        value={condition.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as 'equals' | 'not_equals' })}
        className="px-3 py-2 border rounded-md"
      >
        <option value="equals">equals</option>
        <option value="not_equals">not equals</option>
      </select>
      <select
        value={condition.sourceValue}
        onChange={(e) => onUpdate({ sourceValue: e.target.value })}
        className="flex-1 px-3 py-2 border rounded-md"
      >
        <option value="">Select Value</option>
        {selectedParam?.values.map(value => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
      <button
        onClick={onRemove}
        className="text-red-600 hover:bg-red-100 p-1 rounded"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};