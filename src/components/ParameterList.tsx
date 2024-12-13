import React from 'react';
import { Trash2 } from 'lucide-react';
import { useParameterStore } from '../store/parameterStore';
import { ValueInput } from './ValueInput';

export const ParameterList: React.FC = () => {
  const { parameters, removeParameter, addValue, removeValue } = useParameterStore();

  if (!parameters?.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        No parameters added yet. Add a parameter using the form above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {parameters.map((param) => (
        <div key={param.id} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold">
                {param.name}##{param.type}##{param.unit}
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
            type={param.type === 'NUMBER' ? 'number' : 'text'}
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
  );
};