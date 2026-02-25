export const createNotification = (unit: any) => { // TODO: Define Unit type
  chrome.notifications.create(String(unit.id), {
    type: 'basic',
    iconUrl: 'icon-128.png',
    title: 'Your Daily Scripture',
    message: `${unit.book} ${unit.chapter}:${unit.verse_start}-${unit.verse_end}`,
    contextMessage: unit.text,
    buttons: [
      { title: 'Mark as Read' },
      { title: 'Snooze' }
    ]
  });
  console.log('Notification created for unit:', unit.id);
};

export const markUnitAsRead = (notificationId: string) => {
  // Call API to mark unit as read
  console.log('Marking unit as read:', notificationId);
  chrome.notifications.clear(notificationId);
};
