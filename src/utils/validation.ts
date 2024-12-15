import { Parameter } from '../types/parameter';
import { MappingRule } from '../types/mapping';

export const validateParameter = (parameter: Omit<Parameter, 'id'>): boolean => {
  return Boolean(
    parameter.name &&
    parameter.type &&
    parameter.unit
  );
};

export const validateMappingRule = (rule: MappingRule): boolean => {
  return (
    rule.conditions.length > 0 &&
    rule.consequences.length > 0 &&
    rule.conditions.every(c => c.sourceParam && c.sourceValue) &&
    rule.consequences.every(c => c.targetParam && c.targetValue)
  );
};