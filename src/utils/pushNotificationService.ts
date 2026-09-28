export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
};

export const requestPushPermission = async (): Promise<boolean> => {
  if (!isPushSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return false;
  }
};

export const sendLocalNotification = (title: string, options?: NotificationOptions) => {
  if (!isPushSupported() || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      icon: '/badge-72.png',
      badge: '/badge-72.png',
      ...options
    });
  } catch (err) {
    console.warn('Local notification dispatch error:', err);
  }
};
