import { Parameter } from '../types/parameter';
import { MappingRule } from '../types/mapping';

interface ImportResult {
  parameters: Parameter[];
  mappings?: MappingRule[];
  rows?: string[][];
}

export class FileImporter {
  static async import(file: File): Promise<ImportResult> {
    const content = await this.readFile(file);
    const fileType = this.getFileType(file.name);
    
    switch (fileType) {
      case 'json':
        return this.parseJSON(content);
      case 'csv':
        return this.parseCSV(content);
      default:
        throw new Error('Unsupported file type');
    }
  }

  private static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension || !['json', 'csv'].includes(extension)) {
      throw new Error('Unsupported file type');
    }
    return extension;
  }

  private static parseJSON(content: string): ImportResult {
    const data = JSON.parse(content);
    return {
      parameters: data.parameters,
      mappings: data.mappings
    };
  }

  private static parseCSV(content: string): ImportResult {
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    const headers = this.parseCSVLine(lines[0]);
    const parameters = this.createParametersFromHeaders(headers.slice(1));
    const rows = lines.slice(1).map(line => this.parseCSVLine(line).slice(1));
    
    rows.forEach(row => {
      row.forEach((value, index) => {
        if (value && !parameters[index].values.includes(value)) {
          parameters[index].values.push(value);
        }
      });
    });

    return { parameters, rows };
  }

  private static parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    return values;
  }

  private static createParametersFromHeaders(headers: string[]): Parameter[] {
    return headers.map(header => {
      const [name, type = 'OTHER', unit = 'GENERAL'] = header.split('##');
      return {
        id: crypto.randomUUID(),
        name,
        type: this.validateType(type),
        unit: this.validateUnit(unit),
        values: []
      };
    });
  }

  private static validateType(type: string): Parameter['type'] {
    const validTypes = ['NUMBER', 'LENGTH', 'AREA', 'VOLUME', 'ANGLE', 'OTHER'];
    return validTypes.includes(type.toUpperCase()) ? type.toUpperCase() as Parameter['type'] : 'OTHER';
  }

  private static validateUnit(unit: string): Parameter['unit'] {
    const validUnits = ['GENERAL', 'PERCENTAGE', 'INCHES', 'FEET', 'SQUARE_FEET', 'CUBIC_FEET', 'DEGREES'];
    return validUnits.includes(unit.toUpperCase()) ? unit.toUpperCase() as Parameter['unit'] : 'GENERAL';
  }
}