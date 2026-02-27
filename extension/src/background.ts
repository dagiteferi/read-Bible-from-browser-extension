import { setupAlarms, scheduleSnooze } from './services/background/alarmManager';
import { createNotification, markUnitAsRead } from './services/background/notificationManager';
import { checkDeliveryWindow } from './services/background/environmentDetector';
import { syncOfflineActions } from './services/background/syncManager';
import { getLocal } from './services/storage/local';
import { getSync } from './services/storage/sync';
import { getOrCreateDeviceId } from './utils/deviceId';
import { getNextUnit } from './services/api/plans';
import { UserSettings } from './types/storage';
import { Plan } from './types/plan';

console.log('Service Worker Loaded');

const ACTIVE_PLAN_KEY = 'activePlan';
const USER_SETTINGS_KEY = 'userSettings';

// Initialize on install/startup
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed or updated.');
  await getOrCreateDeviceId(); // Ensure device ID exists
  setupAlarms();
  await syncOfflineActions(); // Attempt to sync any pending offline actions
});

// Alarm handler
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'check-delivery') return;

  console.log('Alarm "check-delivery" triggered at:', new Date().toLocaleString());

  const currentPlan: Plan | null = await getLocal(ACTIVE_PLAN_KEY);
  console.log('Current active plan in background:', currentPlan);

  if (!currentPlan || !currentPlan.id) {
    console.log('No active plan found or plan ID missing. Diagnostics:');
    try {
      const allLocal = await chrome.storage.local.get(null);
      console.log('Storage (Local):', allLocal);
      const allSync = await chrome.storage.sync.get(null);
      console.log('Storage (Sync):', allSync);
    } catch (e) {
      console.error('Diagnostic error:', e);
    }
    return;
  }

  const userSettings: UserSettings = await getSync(USER_SETTINGS_KEY) || {
    quietHours: { start: '22:00', end: '06:00' },
    workingHours: { start: '08:00', end: '17:00' },
  };

  console.log('Using settings for delivery check:', userSettings);
  const canDeliver = await checkDeliveryWindow(userSettings.quietHours, userSettings.workingHours);

  if (!canDeliver) {
    console.log('Notification delivery blocked by Quiet Hours or Working Hours window.');
    return;
  }

  console.log('Delivery window open. Fetching next unit for plan ID:', currentPlan.id);

  try {
    const response = await getNextUnit(currentPlan.id);
    console.log('Response from getNextUnit:', response);

    if (response && response.unit) {
      console.log('Units found! Creating notification for:', response.unit.book, response.unit.chapter);
      createNotification(response.unit);
    } else {
      console.log('No pending units found for this plan:', response?.message || 'Empty response');
    }
  } catch (error) {
    console.error('API Error while fetching next unit:', error);
  }
});

// Notification click handlers
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  console.log('Notification button clicked:', notificationId, buttonIndex);
  if (buttonIndex === 0) { // Mark as Read
    await markUnitAsRead(notificationId);
    // Optionally, refresh plan progress in popup if it's open
  } else if (buttonIndex === 1) { // Snooze
    chrome.notifications.clear(notificationId);
    scheduleSnooze(); // Schedule a new alarm for snooze
  }
});

chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Notification clicked:', notificationId);
  // Open full verse view
  chrome.tabs.create({ url: `fullverse.html?id=${notificationId}` });
});

// Listen for messages from other parts of the extension (e.g., popup)
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'refreshPlan') {
    // Trigger a refresh of the plan data in the background
    // This might involve re-fetching progress and updating local storage
    console.log('Received refreshPlan message from popup.');
    // You might want to call refreshPlan from usePlanContext here, but that's in the UI thread.
    // For background, you'd re-fetch and update storage directly.
    sendResponse({ status: 'Plan refresh initiated in background.' });
  }
});

export { };