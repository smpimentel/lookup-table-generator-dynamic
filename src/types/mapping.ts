export interface Condition {
  sourceParam: string;
  operator: 'equals' | 'not_equals';
  sourceValue: string;
}

export interface Consequence {
  targetParam: string;
  operator: 'equals' | 'not_equals';
  targetValue: string;
}

export interface MappingRule {
  id: string;
  conditions: Condition[];
  consequences: Consequence[];
  applied: boolean;
}