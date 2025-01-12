import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';

interface ValueInputProps {
  onAddValue: (value: string) => void;  // Callback for adding a new value
  type: 'text' | 'number';              // Input type validation
}

/**
 * Component for adding values to parameters
 * Includes validation and error handling
 */
export const ValueInput: React.FC<ValueInputProps> = ({ onAddValue, type }) => {
  // Local state for input value and error message
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates input value based on type
   * Returns error message or null if valid
   */
  const validateValue = useCallback((val: string) => {
    if (!val.trim()) return 'Value cannot be empty';
    if (type === 'number' && isNaN(Number(val))) return 'Invalid number';
    return null;
  }, [type]);

  /**
   * Handles form submission
   * Validates input and calls onAddValue if valid
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateValue(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      onAddValue(value.trim());
      setValue('');  // Clear input on success
      setError(null);
    } catch (error) {
      setError('Failed to add value');
      console.error('Error adding value:', error);
    }
  }, [value, validateValue, onAddValue]);

  /**
   * Handles input change
   * Clears error state when input changes
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(null);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder="Add value"
          className={`flex-1 px-3 py-1 border rounded ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!!error}
        >
          <Plus size={16} />
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </form>
  );
};