import { TimeRange } from '../types/storage';

export const isWithinTimeRange = (
  currentTime: Date,
  timeRange: TimeRange
): boolean => {
  const [startHour, startMinute] = timeRange.start.split(':').map(Number);
  const [endHour, endMinute] = timeRange.end.split(':').map(Number);

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overnight range, e.g., 22:00 - 06:00
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
};

export const getNextNotificationTime = (
  currentTime: Date,
  workingHours: TimeRange,
  quietHours: TimeRange
): Date => {
  // This is a simplified placeholder. Real implementation would be more complex.
  // For now, just returns current time + 15 minutes if within working hours and not quiet hours.
  const nextTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
  return nextTime;
};
