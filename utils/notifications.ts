import * as Notifications from 'expo-notifications';
import { Event } from './storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule notification for an event
export const scheduleEventNotification = async (event: Event): Promise<string | null> => {
  if (!event.reminderMinutes) return null;

  // Calculate notification time
  let notificationTime: Date;
  if (event.isAllDay) {
    // For all-day events, notify at 9 AM on the event day
    notificationTime = new Date(event.date);
    notificationTime.setHours(9, 0, 0, 0);
  } else if (event.startTime) {
    // For timed events, notify before start time
    notificationTime = new Date(event.startTime.getTime() - event.reminderMinutes * 60 * 1000);
  } else {
    return null;
  }

  // Don't schedule if notification time is in the past
  if (notificationTime <= new Date()) return null;

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Event Reminder',
        body: `${event.title}${event.isAllDay ? '' : ` at ${event.startTime?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'event_reminder',
      },
      trigger: notificationTime as any,
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel notification by ID
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

// Cancel notifications for a specific event
export const cancelEventNotifications = async (event: Event): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.body?.includes(event.title)) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Error canceling event notifications:', error);
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};