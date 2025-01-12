export type RevitParameterType = 'NUMBER' | 'LENGTH' | 'AREA' | 'VOLUME' | 'ANGLE' | 'OTHER';
export type RevitParameterUnit = 'GENERAL' | 'PERCENTAGE' | 'INCHES' | 'FEET' | 'SQUARE_FEET' | 'CUBIC_FEET' | 'DEGREES';

export interface Parameter {
  id: string;
  name: string;
  type: RevitParameterType;
  unit: RevitParameterUnit;
  values: string[];
  description?: string;
}

export interface UnitOption {
  value: RevitParameterUnit;
  label: string;
}

export interface TypeOption {
  value: RevitParameterType;
  label: string;
  units: UnitOption[];
}

export const PARAMETER_TYPES: TypeOption[] = [
  {
    value: 'NUMBER',
    label: 'Number',
    units: [
      { value: 'GENERAL', label: 'General' },
      { value: 'PERCENTAGE', label: 'Percentage' }
    ]
  },
  {
    value: 'LENGTH',
    label: 'Length',
    units: [
      { value: 'INCHES', label: 'Inches' },
      { value: 'FEET', label: 'Feet' }
    ]
  },
  {
    value: 'AREA',
    label: 'Area',
    units: [
      { value: 'SQUARE_FEET', label: 'Square Feet' }
    ]
  },
  {
    value: 'VOLUME',
    label: 'Volume',
    units: [
      { value: 'CUBIC_FEET', label: 'Cubic Feet' }
    ]
  },
  {
    value: 'ANGLE',
    label: 'Angle',
    units: [
      { value: 'DEGREES', label: 'Degrees' }
    ]
  },
  {
    value: 'OTHER',
    label: 'Other',
    units: [
      { value: 'GENERAL', label: 'General' }
    ]
  }
];