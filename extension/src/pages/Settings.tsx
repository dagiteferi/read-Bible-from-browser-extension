import React from 'react';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { DisplaySettings } from '../components/settings/DisplaySettings';
import { DataManagement } from '../components/settings/DataManagement';

const Settings = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo">Settings</h1>
      <NotificationSettings />
      <DisplaySettings />
      <DataManagement />
    </div>
  );
};

export default Settings;