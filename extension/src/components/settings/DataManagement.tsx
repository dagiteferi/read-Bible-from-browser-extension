import React from 'react';

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const UploadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export const DataManagement: React.FC = () => {
  const handleExport = () => alert('Export not yet implemented.');
  const handleImport = () => alert('Import not yet implemented.');
  const handleReset = () => {
    if (confirm('Reset all data? This cannot be undone.')) {
      alert('Reset functionality not yet implemented.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="card">
        <p className="section-header">Data</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DownloadIcon /> Export
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleImport}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <UploadIcon /> Import
          </button>
        </div>
      </div>

      <div className="card" style={{ border: '1px solid hsl(353,42%,32%,0.25)' }}>
        <p className="section-header" style={{ color: 'var(--destructive)' }}>Danger Zone</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>Reset All Data</p>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Permanently delete everything</p>
          </div>
          <button className="btn btn-destructive btn-sm" onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <TrashIcon /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
