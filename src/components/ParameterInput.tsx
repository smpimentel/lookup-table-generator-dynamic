import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useParameterStore } from '../store/useParameterStore';
import { ValueInput } from './ValueInput';
import { RevitParameterType, RevitParameterUnit } from '../types/parameter';

export const ParameterInput: React.FC = () => {
  const { parameters, addParameter, removeParameter, addValue, removeValue } =
    useParameterStore();
  const [newParamName, setNewParamName] = useState('');
  const [newParamType, setNewParamType] = useState<RevitParameterType>('NUMBER');
  const [newParamUnit, setNewParamUnit] = useState<RevitParameterUnit>('GENERAL');
  const [description, setDescription] = useState('');

  const handleAddParameter = () => {
    if (newParamName.trim()) {
      addParameter({
        name: newParamName,
        type: newParamType,
        unit: newParamUnit,
        values: [],
        description: description,
      });
      setNewParamName('');
      setDescription('');
    }
  };

  const getUnitOptions = (type: RevitParameterType): RevitParameterUnit[] => {
    switch (type) {
      case 'NUMBER':
        return ['GENERAL', 'PERCENTAGE'];
      case 'LENGTH':
        return ['INCHES', 'FEET'];
      case 'AREA':
        return ['SQUARE_FEET'];
      case 'VOLUME':
        return ['CUBIC_FEET'];
      case 'ANGLE':
        return ['DEGREES'];
      case 'OTHER':
        return ['GENERAL'];
      default:
        return ['GENERAL'];
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={newParamName}
          onChange={(e) => setNewParamName(e.target.value)}
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
          value={newParamType}
          onChange={(e) => {
            const type = e.target.value as RevitParameterType;
            setNewParamType(type);
            setNewParamUnit(getUnitOptions(type)[0]);
          }}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="NUMBER">Number</option>
          <option value="LENGTH">Length</option>
          <option value="AREA">Area</option>
          <option value="VOLUME">Volume</option>
          <option value="ANGLE">Angle</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          value={newParamUnit}
          onChange={(e) => setNewParamUnit(e.target.value as RevitParameterUnit)}
          className="px-4 py-2 border rounded-lg"
        >
          {getUnitOptions(newParamType).map((unit) => (
            <option key={unit} value={unit}>
              {unit.replace('_', ' ')}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddParameter}
          className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 md:col-span-2"
        >
          <Plus size={20} /> Add Parameter
        </button>
      </div>

      <div className="space-y-4">
        {parameters.map((param) => (
          <div key={param.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {param.name}##
                  {param.type}##
                  {param.unit}
                </h3>
                {param.description && (
                  <p className="text-sm text-gray-500">Description: {param.description}</p>
                )}
              </div>
              <button
                onClick={() => removeParameter(param.id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <ValueInput
              onAddValue={(value) => addValue(param.id, value)}
              type={param.type}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {param.values.map((value, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded"
                >
                  {value}
                  <button
                    onClick={() => removeValue(param.id, index)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};