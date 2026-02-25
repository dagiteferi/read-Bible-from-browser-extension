import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const DataManagement: React.FC = () => {
  const handleExportData = () => {
    // Implement data export logic
    console.log('Exporting data...');
    alert('Data export functionality is not yet implemented.');
  };

  const handleImportData = () => {
    // Implement data import logic
    console.log('Importing data...');
    alert('Data import functionality is not yet implemented.');
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Data Management</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Manage your extension data, including export and import options.
      </p>

      <div className="mt-4 space-y-3">
        <Button onClick={handleExportData} className="w-full bg-olive-mountain">
          Export My Data
        </Button>
        <Button onClick={handleImportData} className="w-full bg-indigo-deep">
          Import Data
        </Button>
      </div>
    </Card>
  );
};
