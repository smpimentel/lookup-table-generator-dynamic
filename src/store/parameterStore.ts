import { create } from 'zustand';
import { Parameter } from '../types/parameter';
import { generateCombinations, updateParameterCombinations, combineWithImported } from '../utils/combinationUtils';

interface ParameterState {
  parameters: Parameter[];
  combinations: string[][] | null;
  importedRows: string[][] | null;
  addParameter: (parameter: Omit<Parameter, 'id'>) => void;
  removeParameter: (id: string) => void;
  addValue: (parameterId: string, value: string) => void;
  removeValue: (parameterId: string, valueIndex: number) => void;
  loadParameters: (parameters: Parameter[], rows?: string[][] | null) => void;
}

export const useParameterStore = create<ParameterState>((set, get) => ({
  parameters: [],
  combinations: null,
  importedRows: null,

  addParameter: (parameter) =>
    set((state) => {
      const newParameters = [
        ...state.parameters,
        { ...parameter, id: crypto.randomUUID() }
      ];
      
      // Generate new combinations including the new parameter
      const newCombinations = state.combinations 
        ? combineWithImported(state.combinations, [parameter])
        : generateCombinations(newParameters.map(p => p.values));

      return {
        parameters: newParameters,
        combinations: newCombinations
      };
    }),

  removeParameter: (id) =>
    set((state) => {
      const newParameters = state.parameters.filter(p => p.id !== id);
      
      // Regenerate combinations without the removed parameter
      const newCombinations = generateCombinations(newParameters.map(p => p.values));

      return {
        parameters: newParameters,
        combinations: newCombinations
      };
    }),

  addValue: (parameterId, value) =>
    set((state) => {
      const parameterIndex = state.parameters.findIndex(p => p.id === parameterId);
      if (parameterIndex === -1) return state;

      const updatedParameters = state.parameters.map((p, index) =>
        index === parameterIndex
          ? { ...p, values: [...p.values, value] }
          : p
      );

      const updatedCombinations = updateParameterCombinations(
        state.combinations,
        updatedParameters,
        parameterIndex
      );

      return {
        parameters: updatedParameters,
        combinations: updatedCombinations,
      };
    }),

  removeValue: (parameterId, valueIndex) =>
    set((state) => {
      const parameterIndex = state.parameters.findIndex(p => p.id === parameterId);
      if (parameterIndex === -1) return state;

      const updatedParameters = state.parameters.map((p, index) =>
        index === parameterIndex
          ? {
              ...p,
              values: p.values.filter((_, i) => i !== valueIndex),
            }
          : p
      );

      // Regenerate all combinations when removing a value
      const updatedCombinations = generateCombinations(
        updatedParameters.map(p => p.values)
      );

      return {
        parameters: updatedParameters,
        combinations: updatedCombinations,
      };
    }),

  loadParameters: (parameters, rows = null) =>
    set(() => {
      let initialCombinations: string[][] | null = null;

      if (rows) {
        // If we have imported rows, use them as initial combinations
        initialCombinations = rows;
      } else if (parameters.length > 0) {
        // Otherwise generate combinations from parameter values
        initialCombinations = generateCombinations(parameters.map(p => p.values));
      }

      return {
        parameters,
        importedRows: rows,
        combinations: initialCombinations,
      };
    }),
}));