import { markUnitAsRead as apiMarkUnitAsRead } from '../../services/api/units';
import { Unit } from '../../types/api';

export const createNotification = (unit: Unit) => {
  chrome.notifications.create(unit.id, {
    type: 'basic',
    iconUrl: 'icon-128.png',
    title: 'Your Daily Scripture',
    message: `${unit.book} ${unit.chapter}:${unit.verse_start}${unit.verse_end ? '-' + unit.verse_end : ''}`,
    contextMessage: unit.text,
    buttons: [
      { title: 'Mark as Read' },
      { title: 'Snooze' }
    ]
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Error creating notification:', chrome.runtime.lastError);
    } else {
      console.log('Notification created with ID:', notificationId);
    }
  });
};

export const markUnitAsRead = async (unitId: string) => {
  try {
    await apiMarkUnitAsRead(unitId);
    console.log(`Unit ${unitId} marked as read via API.`);
    chrome.notifications.clear(unitId);
    chrome.runtime.sendMessage({ action: 'refreshPlan' });
  } catch (error) {
    console.error(`Failed to mark unit ${unitId} as read:`, error);
  }
};