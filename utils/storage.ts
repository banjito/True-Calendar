import AsyncStorage from '@react-native-async-storage/async-storage';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'weekdays' | 'custom';

export type ViewMode = 'month' | 'twoweeks' | 'week';

export interface Event {
  id: number;
  title: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  isAllDay: boolean;
  recurrence: {
    type: RecurrenceType;
    daysOfWeek?: number[];
    endDate?: Date;
  };
  reminderMinutes?: number; // Minutes before event to send reminder
}

const EVENTS_STORAGE_KEY = '@true_calendar_events';
const VIEWMODE_STORAGE_KEY = '@true_calendar_viewmode';

export const saveEvents = async (events: Event[]): Promise<void> => {
  try {
    // Convert Date objects to ISO strings for storage
    const eventsForStorage = events.map(event => ({
      ...event,
      date: event.date.toISOString(),
      startTime: event.startTime?.toISOString(),
      endTime: event.endTime?.toISOString(),
      recurrence: {
        ...event.recurrence,
        daysOfWeek: event.recurrence.daysOfWeek,
        endDate: event.recurrence.endDate?.toISOString(),
      },
      reminderMinutes: event.reminderMinutes,
    }));
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(eventsForStorage));
  } catch (error) {
    console.error('Error saving events:', error);
    throw error;
  }
};

export const loadEvents = async (): Promise<Event[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!eventsJson) return [];

    // Parse and convert ISO strings back to Date objects
    const eventsFromStorage = JSON.parse(eventsJson);
    return eventsFromStorage.map((event: any) => ({
      ...event,
      date: new Date(event.date),
      startTime: event.startTime ? new Date(event.startTime) : undefined,
      endTime: event.endTime ? new Date(event.endTime) : undefined,
      recurrence: {
        ...event.recurrence,
        daysOfWeek: event.recurrence.daysOfWeek,
        endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : undefined,
      },
      reminderMinutes: event.reminderMinutes,
    }));
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const clearEvents = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(EVENTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing events:', error);
    throw error;
  }
};

export const saveViewMode = async (viewMode: ViewMode): Promise<void> => {
  try {
    await AsyncStorage.setItem(VIEWMODE_STORAGE_KEY, viewMode);
  } catch (error) {
    console.error('Error saving view mode:', error);
    throw error;
  }
};

export const loadViewMode = async (): Promise<ViewMode> => {
  try {
    const viewMode = await AsyncStorage.getItem(VIEWMODE_STORAGE_KEY);
    return (viewMode as ViewMode) || 'month';
  } catch (error) {
    console.error('Error loading view mode:', error);
    return 'month';
  }
};