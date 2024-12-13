import React from 'react';
import { Parameter } from '../types/parameter';

interface TableHeaderProps {
  parameters: Parameter[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ parameters }) => (
  <thead className="bg-gray-50">
    <tr>
      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b border-r">
        Description
      </th>
      {parameters.map((param) => (
        <th
          key={param.id}
          className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b border-r"
        >
          {`${param.name}##${param.type}##${param.unit}`}
        </th>
      ))}
    </tr>
  </thead>
);