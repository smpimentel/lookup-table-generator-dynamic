import { create } from 'zustand';
import { Parameter, ParameterSet } from '../types/parameter';

interface ParameterStore {
  parameters: Parameter[];
  savedSets: ParameterSet[];
  addParameter: (parameter: Omit<Parameter, 'id'>) => void;
  removeParameter: (id: string) => void;
  updateParameter: (id: string, parameter: Partial<Parameter>) => void;
  addValue: (parameterId: string, value: string) => void;
  removeValue: (parameterId: string, valueIndex: number) => void;
  saveParameterSet: (name: string) => void;
  loadParameterSet: (id: string) => void;
}

export const useParameterStore = create<ParameterStore>((set) => ({
  parameters: [],
  savedSets: [],
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
  updateParameter: (id, parameter) =>
    set((state) => ({
      parameters: state.parameters.map((p) =>
        p.id === id ? { ...p, ...parameter } : p
      ),
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
  saveParameterSet: (name) =>
    set((state) => ({
      savedSets: [
        ...state.savedSets,
        {
          id: crypto.randomUUID(),
          name,
          parameters: [...state.parameters],
          created: new Date(),
        },
      ],
    })),
  loadParameterSet: (id) =>
    set((state) => ({
      parameters: [
        ...state.savedSets.find((set) => set.id === id)?.parameters || [],
      ],
    })),
}));