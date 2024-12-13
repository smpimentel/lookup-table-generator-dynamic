import { create } from 'zustand';
import { Parameter } from '../types/parameter';

interface ParameterState {
  parameters: Parameter[];
  importedRows: string[][] | null;
  addParameter: (parameter: Omit<Parameter, 'id'>) => void;
  removeParameter: (id: string) => void;
  addValue: (parameterId: string, value: string) => void;
  removeValue: (parameterId: string, valueIndex: number) => void;
  loadParameters: (parameters: Parameter[], rows?: string[][] | null) => void;
}

export const useParameterStore = create<ParameterState>((set) => ({
  parameters: [],
  importedRows: null,
  addParameter: (parameter) =>
    set((state) => ({
      parameters: [
        ...state.parameters,
        { ...parameter, id: crypto.randomUUID() },
      ],
    })),
  removeParameter: (id) =>
    set((state) => ({
      parameters: state.parameters.filter((p) => p.id !== id),
    })),
  addValue: (parameterId, value) =>
    set((state) => ({
      parameters: state.parameters.map((p) =>
        p.id === parameterId
          ? { ...p, values: [...p.values, value] }
          : p
      ),
    })),
  removeValue: (parameterId, valueIndex) =>
    set((state) => ({
      parameters: state.parameters.map((p) =>
        p.id === parameterId
          ? {
              ...p,
              values: p.values.filter((_, index) => index !== valueIndex),
            }
          : p
      ),
    })),
  loadParameters: (parameters, rows = null) =>
    set(() => ({
      parameters,
      importedRows: rows,
    })),
}));