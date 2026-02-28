export interface TimeRange {
  start: string;
  end: string;
}

export interface UserSettings {
  quietHours: TimeRange;
  workingHours: TimeRange;
}

export interface StorageSchema {
  deviceId: string;
  activePlanId: string | null;
  userSettings: UserSettings;
}
