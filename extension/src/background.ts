import { setupAlarms, scheduleSnooze } from './services/background/alarmManager';
import { createNotification, markUnitAsRead } from './services/background/notificationManager';
import { checkDeliveryWindow } from './services/background/environmentDetector';
import { syncOfflineActions } from './services/background/syncManager';
import { getLocal, setLocal } from './services/storage/local';
import { getSync } from './services/storage/sync';
import { getOrCreateDeviceId } from './utils/deviceId';
import { getNextUnit } from './services/api/plans';
import { UserSettings } from './types/storage';
import { Plan } from './types/plan';

console.log('Service Worker Loaded');

const ACTIVE_PLAN_KEY = 'activePlan';
const USER_SETTINGS_KEY = 'userSettings';

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed or updated.');
  await getOrCreateDeviceId();
  setupAlarms();
  await syncOfflineActions();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'check-delivery') return;

  console.log('Alarm "check-delivery" triggered.');

  const currentPlan: Plan | null = await getLocal(ACTIVE_PLAN_KEY);
  if (!currentPlan || !currentPlan.id) {
    console.log('No active plan found. Skipping delivery check.');
    return;
  }

  const userSettings: UserSettings = await getSync(USER_SETTINGS_KEY) || {
    quietHours: { start: '22:00', end: '06:00' },
    workingHours: { start: '08:00', end: '17:00' },
  };

  const canDeliver = await checkDeliveryWindow(userSettings.quietHours, userSettings.workingHours);
  if (!canDeliver) {
    console.log('Cannot deliver notification now (outside delivery window).');
    return;
  }

  try {
    const unit = await getNextUnit(currentPlan.id);
    if (unit) {
      createNotification(unit);
    } else {
      console.log('No next unit available for delivery.');
    }
  } catch (error) {
    console.error('Failed to fetch next unit:', error);
  }
});

chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  console.log('Notification button clicked:', notificationId, buttonIndex);
  if (buttonIndex === 0) {
    await markUnitAsRead(notificationId);
  } else if (buttonIndex === 1) {
    chrome.notifications.clear(notificationId);
    scheduleSnooze();
  }
});

chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Notification clicked:', notificationId);
  chrome.tabs.create({ url: `fullverse.html?id=${notificationId}` });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'refreshPlan') {
    console.log('Received refreshPlan message from popup.');
    sendResponse({ status: 'Plan refresh initiated in background.' });
  }
});

export {};
