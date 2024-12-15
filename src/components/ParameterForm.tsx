import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useParameterStore } from '../store/parameterStore';
import { RevitParameterType, RevitParameterUnit, PARAMETER_TYPES } from '../types/parameter';

export const ParameterForm: React.FC = () => {
  const { addParameter } = useParameterStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<RevitParameterType>('NUMBER');
  const [unit, setUnit] = useState<RevitParameterUnit>('GENERAL');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addParameter({
        name: name.trim(),
        type,
        unit,
        values: [],
        description: description.trim()
      });
      setName('');
      setDescription('');
    }
  };

  const handleTypeChange = (newType: RevitParameterType) => {
    setType(newType);
    const typeOption = PARAMETER_TYPES.find(t => t.value === newType);
    if (typeOption?.units.length) {
      setUnit(typeOption.units[0].value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Parameter name"
        className="px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="px-4 py-2 border rounded-lg"
      />
      <select
        value={type}
        onChange={(e) => handleTypeChange(e.target.value as RevitParameterType)}
        className="px-4 py-2 border rounded-lg"
      >
        {PARAMETER_TYPES.map(type => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as RevitParameterUnit)}
        className="px-4 py-2 border rounded-lg"
      >
        {PARAMETER_TYPES.find(t => t.value === type)?.units.map(unit => (
          <option key={unit.value} value={unit.value}>{unit.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 md:col-span-2"
      >
        <Plus size={20} />
        Add Parameter
      </button>
    </form>
  );
};