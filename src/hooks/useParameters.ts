import { useCallback } from 'react';
import { useParameterStore } from '../store/parameterStore';
import { Parameter } from '../types/parameter';

export const useParameters = () => {
  const { parameters, addParameter, removeParameter, addValue, removeValue } = useParameterStore();

  const handleAddParameter = useCallback((parameter: Omit<Parameter, 'id'>) => {
    addParameter(parameter);
  }, [addParameter]);

  const handleRemoveParameter = useCallback((id: string) => {
    removeParameter(id);
  }, [removeParameter]);

  const handleAddValue = useCallback((parameterId: string, value: string) => {
    addValue(parameterId, value);
  }, [addValue]);

  const handleRemoveValue = useCallback((parameterId: string, valueIndex: number) => {
    removeValue(parameterId, valueIndex);
  }, [removeValue]);

  return {
    parameters,
    addParameter: handleAddParameter,
    removeParameter: handleRemoveParameter,
    addValue: handleAddValue,
    removeValue: handleRemoveValue
  };
};