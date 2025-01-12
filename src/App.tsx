import React, { useState } from 'react';
import { Download, Upload, Save } from 'lucide-react';
import { ParameterForm } from './components/ParameterForm';
import { ParameterList } from './components/ParameterList';
import { MappingRules } from './components/MappingRules';
import { Preview } from './components/Preview';
import { useParameterStore } from './store/parameterStore';
import { useMappingStore } from './store/mappingStore';
import { FileImporter } from './utils/FileImporter';
import { formatCSV } from './utils/parameterUtils'; // Re-add this import
import { downloadFile } from './utils/fileUtils';
import { Notification } from './components/Notification';

/**
 * Main application component that handles:
 * - Parameter management
 * - File import/export
 * - Mapping rules
 * - Preview generation
 */
function App() {
  // State for handling import errors
  const [importError, setImportError] = useState<string | null>(null);
  
  // Global state hooks
  const { parameters, loadParameters } = useParameterStore();
  const { loadMappings } = useMappingStore();

  /**
   * Handles file import for both JSON and CSV files
   * Updates global state with imported data
   */
  const handleImport = async (file: File) => {
    try {
      const { parameters: importedParams, mappings, rows } = await FileImporter.import(file);
      loadParameters(importedParams, rows);
      if (mappings) {
        loadMappings(mappings);
      }
      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import file');
    }
  };

  /**
   * Saves current configuration as JSON file
   * Includes parameters, mappings, and metadata
   */
  const handleSave = () => {
    const configuration = {
      parameters,
      mappings: useMappingStore.getState().mappings,
      version: '1.0.0',
      exportDate: new Date().toISOString()
    };

    downloadFile(
      JSON.stringify(configuration, null, 2),
      `lookup-config-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
  };

  /**
   * Exports current parameter combinations as CSV
   */
  const handleDownload = () => {
    if (parameters.length === 0) return;
    
    const csvContent = formatCSV(parameters);
    downloadFile(
      csvContent,
      `lookup-table-${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lookup Table Generator
            </h1>
            <p className="text-gray-600">
              Create parameter combinations with proper formatting
            </p>
          </div>
          <div className="flex gap-4">
            <input
              type="file"
              id="importInput"
              accept=".json,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
            />
            <button
              onClick={() => document.getElementById('importInput')?.click()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Upload size={20} />
              Import
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Save size={20} />
              Save
            </button>
          </div>
        </div>

        {/* Parameter Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <ParameterForm />
        </div>

        {/* Parameter List Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <ParameterList />
        </div>

        {/* Mapping Rules Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <MappingRules />
        </div>

        {/* Preview Section */}
        {parameters.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Table</h2>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={20} />
                Download CSV
              </button>
            </div>
            <Preview />
          </div>
        )}

        {/* Error Notification */}
        <Notification
          show={!!importError}
          message={importError || ''}
          type="error"
          onClose={() => setImportError(null)}
        />
      </div>
    </div>
  );
}

export default App;