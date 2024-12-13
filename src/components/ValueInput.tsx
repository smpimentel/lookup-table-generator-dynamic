import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface ValueInputProps {
  onAddValue: (value: string) => void;
  prefix?: string;
  type: 'text' | 'number' | 'select';
}

export const ValueInput: React.FC<ValueInputProps> = ({ onAddValue, prefix = '', type }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      const formattedValue = prefix ? `${prefix}_${value}` : value;
      onAddValue(formattedValue);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type={type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add value"
        className="flex-1 px-3 py-1 border rounded"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Plus size={16} />
      </button>
    </form>
  );
};