import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const DataManagement: React.FC = () => {
  const handleExportData = () => {
    console.log('Exporting data...');
    alert('Data export functionality is not yet implemented.');
  };

  const handleImportData = () => {
    console.log('Importing data...');
    alert('Data import functionality is not yet implemented.');
  };

  return (
    <Card className="space-y-24">
      <div className="space-y-4">
        <h3 className="text-12 font-bold uppercase tracking-widest text-burgundy-curtain">
          Sacred Archives
        </h3>
        <p className="text-[10px] text-text-secondary dark:text-night-text-muted italic">
          Preserve your journey or restore from a past commitment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-16">
        <Button variant="secondary" onClick={handleExportData} className="text-12 py-12">
          Export
        </Button>
        <Button variant="ghost" onClick={handleImportData} className="text-12 py-12 opacity-50">
          Import
        </Button>
      </div>
    </Card>
  );
};
