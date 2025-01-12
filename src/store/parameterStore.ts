import { create } from 'zustand';
import { Parameter } from '../types/parameter';
import { generateCombinations } from '../utils/combinationUtils';

/**
 * Interface defining the parameter store state and actions
 */
interface ParameterState {
  parameters: Parameter[];              // List of all parameters
  combinations: string[][] | null;      // Generated combinations of parameter values
  importedRows: string[][] | null;      // Imported data rows (if any)
  addParameter: (parameter: Omit<Parameter, 'id'>) => void;
  removeParameter: (id: string) => void;
  addValue: (parameterId: string, value: string) => void;
  removeValue: (parameterId: string, valueIndex: number) => void;
  loadParameters: (parameters: Parameter[], rows?: string[][] | null) => void;
}

/**
 * Parameter store implementation using Zustand
 * Manages parameter state and combinations generation
 */
export const useParameterStore = create<ParameterState>((set) => ({
  parameters: [],
  combinations: null,
  importedRows: null,

  /**
   * Adds a new parameter to the store
   * Regenerates combinations including the new parameter
   */
  addParameter: (parameter) =>
    set((state) => {
      try {
        const newParameter = { ...parameter, id: crypto.randomUUID() };
        const newParameters = [...state.parameters, newParameter];
        const parameterValues = newParameters.map(p => p.values);
        
        // Only generate combinations if there are values
        const newCombinations = parameterValues.some(values => values.length > 0)
          ? generateCombinations(parameterValues)
          : null;

        return {
          parameters: newParameters,
          combinations: newCombinations
        };
      } catch (error) {
        console.error('Error adding parameter:', error);
        return state;
      }
    }),

  /**
   * Removes a parameter from the store
   * Regenerates combinations excluding the removed parameter
   */
  removeParameter: (id) =>
    set((state) => {
      try {
        const newParameters = state.parameters.filter(p => p.id !== id);
        const parameterValues = newParameters.map(p => p.values);
        
        // Only generate combinations if there are values
        const newCombinations = parameterValues.some(values => values.length > 0)
          ? generateCombinations(parameterValues)
          : null;

        return {
          parameters: newParameters,
          combinations: newCombinations
        };
      } catch (error) {
        console.error('Error removing parameter:', error);
        return state;
      }
    }),

  /**
   * Adds a value to a specific parameter
   * Updates combinations to include the new value
   */
  addValue: (parameterId, value) =>
    set((state) => {
      try {
        const parameterIndex = state.parameters.findIndex(p => p.id === parameterId);
        if (parameterIndex === -1) return state;

        const updatedParameters = [...state.parameters];
        const parameter = { ...updatedParameters[parameterIndex] };
        
        // Prevent duplicate values
        if (parameter.values.includes(value)) return state;
        
        parameter.values = [...parameter.values, value];
        updatedParameters[parameterIndex] = parameter;

        // Generate new combinations with the added value
        const parameterValues = updatedParameters.map(p => p.values);
        const newCombinations = generateCombinations(parameterValues);

        return {
          parameters: updatedParameters,
          combinations: newCombinations
        };
      } catch (error) {
        console.error('Error adding value:', error);
        return state;
      }
    }),

  /**
   * Removes a value from a specific parameter
   * Updates combinations to exclude the removed value
   */
  removeValue: (parameterId, valueIndex) =>
    set((state) => {
      try {
        const parameterIndex = state.parameters.findIndex(p => p.id === parameterId);
        if (parameterIndex === -1) return state;

        const updatedParameters = [...state.parameters];
        const parameter = { ...updatedParameters[parameterIndex] };
        parameter.values = parameter.values.filter((_, i) => i !== valueIndex);
        updatedParameters[parameterIndex] = parameter;

        const parameterValues = updatedParameters.map(p => p.values);
        const newCombinations = parameterValues.some(values => values.length > 0)
          ? generateCombinations(parameterValues)
          : null;

        return {
          parameters: updatedParameters,
          combinations: newCombinations
        };
      } catch (error) {
        console.error('Error removing value:', error);
        return state;
      }
    }),

  /**
   * Loads parameters and optional imported rows into the store
   * Used when importing data from files
   */
  loadParameters: (parameters, rows = null) =>
    set(() => {
      try {
        const parameterValues = parameters.map(p => p.values);
        const newCombinations = parameterValues.some(values => values.length > 0)
          ? generateCombinations(parameterValues)
          : null;

        return {
          parameters,
          importedRows: rows,
          combinations: rows || newCombinations
        };
      } catch (error) {
        console.error('Error loading parameters:', error);
        return { parameters: [], combinations: null, importedRows: null };
      }
    })
}));