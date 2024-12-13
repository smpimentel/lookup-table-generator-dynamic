import { create } from 'zustand';
import { MappingRule } from '../types/mapping';

interface MappingState {
  mappings: MappingRule[];
  addMapping: () => void;
  removeMapping: (id: string) => void;
  updateMapping: (id: string, updates: Partial<MappingRule>) => void;
  loadMappings: (mappings: MappingRule[]) => void;
}

export const useMappingStore = create<MappingState>((set) => ({
  mappings: [],
  addMapping: () =>
    set((state) => ({
      mappings: [
        ...state.mappings,
        {
          id: crypto.randomUUID(),
          conditions: [],
          consequences: [],
          applied: false,
        },
      ],
    })),
  removeMapping: (id) =>
    set((state) => ({
      mappings: state.mappings.filter((m) => m.id !== id),
    })),
  updateMapping: (id, updates) =>
    set((state) => ({
      mappings: state.mappings.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  loadMappings: (mappings) => set({ mappings }),
}));