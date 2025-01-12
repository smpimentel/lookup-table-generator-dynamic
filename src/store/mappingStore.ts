import { create } from 'zustand';
import { MappingRule } from '../types/mapping';

/**
 * Interface defining the mapping store state and actions
 */
interface MappingState {
  mappings: MappingRule[];            // List of all mapping rules
  addMapping: () => void;             // Adds a new mapping rule
  removeMapping: (id: string) => void; // Removes a mapping rule
  updateMapping: (id: string, updates: Partial<MappingRule>) => void;  // Updates a mapping rule
  loadMappings: (mappings: MappingRule[]) => void;  // Loads mapping rules (e.g., from import)
}

/**
 * Mapping store implementation using Zustand
 * Manages mapping rules for parameter combinations
 */
export const useMappingStore = create<MappingState>((set) => ({
  mappings: [],

  /**
   * Adds a new empty mapping rule
   */
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

  /**
   * Removes a mapping rule by ID
   */
  removeMapping: (id) =>
    set((state) => ({
      mappings: state.mappings.filter((m) => m.id !== id),
    })),

  /**
   * Updates an existing mapping rule with new values
   */
  updateMapping: (id, updates) =>
    set((state) => ({
      mappings: state.mappings.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  /**
   * Loads a set of mapping rules (used for imports)
   */
  loadMappings: (mappings) => set({ mappings }),
}));