import { TimeRange } from '../../types/storage';
import { isWithinTimeRange } from '../../utils/dateHelpers';

export const checkDeliveryWindow = async (
  quietHours: TimeRange,
  workingHours: TimeRange
): Promise<boolean> => {
  const now = new Date();

  // 1. Check Quiet Hours
  if (isWithinTimeRange(now, quietHours)) {
    console.log('Within quiet hours. Skipping notification.');
    return false;
  }

  // 2. Check Working Hours (optional, but good for preference)
  // If outside working hours, we might still deliver but prioritize within.
  // For strict adherence, uncomment below:
  /*
  if (!isWithinTimeRange(now, workingHours)) {
    console.log('Outside working hours. Skipping notification.');
    return false;
  }
  */

  // 3. Check Fullscreen Mode
  // This requires 'activeTab' and 'scripting' permissions and injecting a script.
  // For simplicity, we'll assume not in fullscreen for now, or implement a basic check.
  // A more robust check would involve:
  // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // if (tab && tab.id) {
  //   const results = await chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     function: () => document.fullscreenElement !== null,
  //   });
  //   if (results && results[0] && results[0].result) {
  //     console.log('In fullscreen mode. Skipping notification.');
  //     return false;
  //   }
  // }

  console.log('Within delivery window.');
  return true;
};