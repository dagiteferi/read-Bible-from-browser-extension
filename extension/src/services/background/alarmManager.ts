export const setupAlarms = () => {
  chrome.alarms.clearAll(() => {
    chrome.alarms.create('check-delivery', { periodInMinutes: 15 });
    console.log('Alarm "check-delivery" set for every 15 minutes.');
  });
};

export const scheduleSnooze = (delayInMinutes: number = 30) => {
  const alarmName = `snooze-${Date.now()}`;
  chrome.alarms.create(alarmName, { delayInMinutes });
  console.log(`Snooze alarm "${alarmName}" scheduled for ${delayInMinutes} minutes.`);
};

export const clearAllAlarms = () => {
  chrome.alarms.clearAll(() => {
    console.log('All alarms cleared.');
  });
};
