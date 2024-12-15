import { useCallback } from 'react';
import { useMappingStore } from '../store/mappingStore';
import { MappingRule } from '../types/mapping';

export const useMappings = () => {
  const { mappings, addMapping, removeMapping, updateMapping } = useMappingStore();

  const handleAddMapping = useCallback(() => {
    addMapping();
  }, [addMapping]);

  const handleRemoveMapping = useCallback((id: string) => {
    removeMapping(id);
  }, [removeMapping]);

  const handleUpdateMapping = useCallback((id: string, updates: Partial<MappingRule>) => {
    updateMapping(id, updates);
  }, [updateMapping]);

  return {
    mappings,
    addMapping: handleAddMapping,
    removeMapping: handleRemoveMapping,
    updateMapping: handleUpdateMapping
  };
};