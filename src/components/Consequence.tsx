import React from 'react';
import { Trash2 } from 'lucide-react';
import { Consequence as IConsequence } from '../types/mapping';
import { Parameter } from '../types/parameter';

interface Props {
  consequence: IConsequence;
  parameters: Parameter[];
  onUpdate: (updates: Partial<IConsequence>) => void;
  onRemove: () => void;
}

export const Consequence: React.FC<Props> = ({
  consequence,
  parameters,
  onUpdate,
  onRemove,
}) => {
  const selectedParam = parameters.find(p => p.id === consequence.targetParam);

  return (
    <div className="flex gap-2 items-center">
      <select
        value={consequence.targetParam}
        onChange={(e) => onUpdate({ targetParam: e.target.value, targetValue: '' })}
        className="flex-1 px-3 py-2 border rounded-md"
      >
        <option value="">Select Parameter</option>
        {parameters.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select
        value={consequence.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as 'equals' | 'not_equals' })}
        className="px-3 py-2 border rounded-md"
      >
        <option value="equals">must equal</option>
        <option value="not_equals">must not equal</option>
      </select>
      <select
        value={consequence.targetValue}
        onChange={(e) => onUpdate({ targetValue: e.target.value })}
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