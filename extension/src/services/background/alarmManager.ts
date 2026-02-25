export const setupAlarms = () => {
  chrome.alarms.create('check-delivery', { periodInMinutes: 15 });
  console.log('Alarm "check-delivery" set for every 15 minutes.');
};

export const scheduleSnooze = () => {
  // Implement snooze logic, e.g., create a temporary alarm
  console.log('Snooze scheduled.');
};
