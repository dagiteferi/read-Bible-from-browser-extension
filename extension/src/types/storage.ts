export interface TimeRange {
  start: string; // e.g., "22:00"
  end: string;   // e.g., "06:00"
}

export interface UserSettings {
  quietHours: TimeRange;
  workingHours: TimeRange;
  // Add other settings here
}

export interface StorageSchema {
  deviceId: string;
  activePlanId: string | null;
  userSettings: UserSettings;
  // Add other storage keys here
}
