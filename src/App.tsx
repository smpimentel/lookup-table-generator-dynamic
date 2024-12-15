import React, { useState } from 'react';
import { Download, FolderDown, Save } from 'lucide-react';
import { ParameterForm } from './components/ParameterForm';
import { ParameterList } from './components/ParameterList';
import { MappingRules } from './components/MappingRules';
import { Preview } from './components/Preview';
import { useParameterStore } from './store/parameterStore';
import { useMappingStore } from './store/mappingStore';
import { FileImporter } from './utils/FileImporter';
import { formatCSV } from './utils/parameterUtils';
import { downloadFile } from './utils/fileUtils';
import { Notification } from './components/Notification';

function App() {
  const [importError, setImportError] = useState<string | null>(null);
  const { parameters, loadParameters } = useParameterStore();
  const { loadMappings } = useMappingStore();

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
              <FolderDown size={20} />
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <ParameterForm />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <ParameterList />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <MappingRules />
        </div>

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