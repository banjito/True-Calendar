import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../styles';
import { Event, RecurrenceType, saveEvents, loadEvents, ViewMode, saveViewMode, loadViewMode } from '../utils/storage';

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | null>(null);

  // Load events and viewMode from storage on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedEvents = await loadEvents();
        setEvents(storedEvents);
        const storedViewMode = await loadViewMode();
        setViewMode(storedViewMode);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadStoredData();
  }, []);

  // Save events to storage whenever events change
  useEffect(() => {
    const saveEventsToStorage = async () => {
      try {
        await saveEvents(events);
      } catch (error) {
        console.error('Failed to save events:', error);
      }
    };
    saveEventsToStorage();
  }, [events]);

  // Save viewMode to storage whenever it changes
  useEffect(() => {
    const saveViewModeToStorage = async () => {
      try {
        await saveViewMode(viewMode);
      } catch (error) {
        console.error('Failed to save view mode:', error);
      }
    };
    saveViewModeToStorage();
  }, [viewMode]);

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Get the start of the week for a given date (Sunday)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Get days for the current view mode
  const getDaysForView = (mode: ViewMode, date: Date) => {
    if (mode === 'month') {
      return getDaysInMonth(date);
    } else if (mode === 'week') {
      const startOfWeek = getStartOfWeek(date);
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i));
      }
      return days;
    } else if (mode === 'twoweeks') {
      const startOfWeek = getStartOfWeek(date);
      const days = [];
      for (let i = 0; i < 14; i++) {
        days.push(new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i));
      }
      return days;
    }
    return [];
  };

    const days = getDaysForView(viewMode, currentDate);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get title for the current view
    const getViewTitle = (mode: ViewMode, dates: (Date | null)[]) => {
      const validDates = dates.filter(d => d !== null) as Date[];
      if (validDates.length === 0) return '';

      if (mode === 'month') {
        return `${monthNames[validDates[0].getMonth()]} ${validDates[0].getFullYear()}`;
      } else {
        const start = validDates[0];
        const end = validDates[validDates.length - 1];
        const startMonth = monthNames[start.getMonth()].slice(0, 3);
        const endMonth = monthNames[end.getMonth()].slice(0, 3);
        const startDay = start.getDate();
        const endDay = end.getDate();
        const year = start.getFullYear();
        if (startMonth === endMonth) {
          return `${startMonth} ${startDay}–${endDay}, ${year}`;
        } else {
          return `${startMonth} ${startDay}–${endMonth} ${endDay}, ${year}`;
        }
      }
    };

    // Dynamic cell height based on view mode
    const getCellHeight = (mode: ViewMode) => {
      switch (mode) {
        case 'month': return 70;
        case 'twoweeks': return 100;
        case 'week': return 140;
        default: return 70;
      }
    };
    const cellHeight = getCellHeight(viewMode);

  const navigatePeriod = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'twoweeks') {
      newDate.setDate(newDate.getDate() + direction * 14);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    }
    setCurrentDate(newDate);
  };

  const onGestureEvent = (event: any) => {
    // Handle gesture if needed, but we'll use onHandlerStateChange
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      const threshold = 20;
      const velocityThreshold = 300;

      if (Math.abs(translationX) > threshold || Math.abs(velocityX) > velocityThreshold) {
        if (translationX > 0 || velocityX > velocityThreshold) {
          // Swipe right or fast right: zoom out
          if (viewMode === 'twoweeks') {
            setViewMode('month');
          } else if (viewMode === 'week') {
            setViewMode('twoweeks');
          }
        } else if (translationX < 0 || velocityX < -velocityThreshold) {
          // Swipe left or fast left: zoom in
          if (viewMode === 'month') {
            setViewMode('twoweeks');
          } else if (viewMode === 'twoweeks') {
            setViewMode('week');
          }
        }
      }
    }
  };

  const isToday = (date: Date | null) => {
    const today = new Date();
    return date &&
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date | null) => {
    return date && selectedDate &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const addEvent = () => {
    if (eventTitle.trim() && selectedDate) {
      const newEvent: Event = {
        id: Date.now(),
        title: eventTitle.trim(),
        date: selectedDate,
        isAllDay,
        startTime: isAllDay ? undefined : startTime || undefined,
        endTime: isAllDay ? undefined : endTime || undefined,
        recurrence: {
          type: recurrenceType,
          endDate: recurrenceEndDate || undefined,
        },
      };
      setEvents(prev => [...prev, newEvent]);
      setEventTitle('');
      setIsAllDay(true);
      setStartTime(null);
      setEndTime(null);
      setRecurrenceType('none');
      setRecurrenceEndDate(null);
      setModalVisible(false);
    }
  };

  const doesDateMatchRecurrence = (checkDate: Date, eventDate: Date, recurrence: Event['recurrence']): boolean => {
    if (recurrence.type === 'none') return checkDate.toDateString() === eventDate.toDateString();
    if (recurrence.endDate && checkDate > recurrence.endDate) return false;

    const diffTime = checkDate.getTime() - eventDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    switch (recurrence.type) {
      case 'daily':
        return diffDays >= 0;
      case 'weekly':
        return diffDays >= 0 && diffDays % 7 === 0;
      case 'biweekly':
        return diffDays >= 0 && diffDays % 14 === 0;
      case 'monthly':
        return checkDate.getDate() === eventDate.getDate() && checkDate >= eventDate;
      case 'yearly':
        return checkDate.getMonth() === eventDate.getMonth() &&
               checkDate.getDate() === eventDate.getDate() &&
               checkDate >= eventDate;
      default:
        return false;
    }
  };

  const getEventsForDate = (date: Date | null): Event[] => {
    if (!date) return [];
    return events.filter(event => doesDateMatchRecurrence(date, event.date, event.recurrence));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigatePeriod(-1)}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primaryText }}>
              {getViewTitle(viewMode, days)}
            </Text>
          </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigatePeriod(1)}
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

        <View style={styles.calendar}>
          <View style={styles.daysGrid}>
            {days.map((date, index) => (
               <TouchableOpacity
                 key={index}
                 style={[
                   styles.dayCell,
                   { height: cellHeight },
                   isSelected(date) && styles.selectedCell,
                   isToday(date) && styles.todayCell,
                 ]}
                 onPress={() => date && setSelectedDate(date)}
                 disabled={!date}
               >
               {date && (
                 <View style={styles.dayContent}>
                     <Text
                       style={[
                         styles.dayText,
                         isSelected(date) && styles.selectedText,
                         isToday(date) && styles.todayText,
                       ]}
                     >
                     {date.getDate()}
                   </Text>
                    {getEventsForDate(date).some(event => !event.isAllDay) && (
                      <View style={styles.timedEventIndicator} />
                    )}
                    {getEventsForDate(date).some(event => event.isAllDay) && (
                      <View style={styles.eventIndicator} />
                    )}
                 </View>
               )}
             </TouchableOpacity>
           ))}
         </View>
       </View>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          minDeltaX={10}
          minDeltaY={10}
          activeOffsetX={[-10, 10]}
          failOffsetY={[-10, 10]}
        >
          <View style={styles.selectedDateInfo}>
             <Text style={{ fontSize: 16, fontWeight: '400', color: colors.primaryText }}>
               {selectedDate ? `Selected: ${selectedDate.toDateString()}` : getViewTitle(viewMode, days)}
             </Text>
             {selectedDate && getEventsForDate(selectedDate).map((event) => (
               <View key={event.id} style={styles.eventItem}>
                 <Text style={styles.eventBullet}>•</Text>
                 <View style={styles.eventContent}>
                   <Text style={styles.eventText}>
                     {event.title}
                     {!event.isAllDay && event.startTime && event.endTime ? ` (${event.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${event.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` : ''}
                     {event.recurrence.type !== 'none' ? ' (Recurring)' : ''}
                   </Text>
                 </View>
               </View>
             ))}
          </View>
        </PanGestureHandler>

       <TouchableOpacity
         style={styles.fab}
         onPress={() => {
           if (!selectedDate) {
             setSelectedDate(new Date());
           }
           setModalVisible(true);
         }}
       >
         <Text style={styles.fabText}>+</Text>
       </TouchableOpacity>

       <Modal
         animationType="fade"
         transparent={true}
         visible={modalVisible}
         onRequestClose={() => setModalVisible(false)}
       >
         <View style={styles.modalOverlay}>
           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
             <View style={styles.modalContent}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primaryText }}>Add Event</Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: colors.secondaryText }}>
                {selectedDate ? selectedDate.toDateString() : new Date().toDateString()}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Event title"
                placeholderTextColor={colors.secondaryText}
                value={eventTitle}
                onChangeText={setEventTitle}
              />

              <View style={styles.allDayToggle}>
                <TouchableOpacity
                  style={[styles.toggleButton, isAllDay && styles.toggleButtonSelected]}
                  onPress={() => setIsAllDay(true)}
                >
                  <Text style={[styles.toggleText, isAllDay && styles.toggleTextSelected]}>
                    All Day
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, !isAllDay && styles.toggleButtonSelected]}
                  onPress={() => setIsAllDay(false)}
                >
                  <Text style={[styles.toggleText, !isAllDay && styles.toggleTextSelected]}>
                    Timed
                  </Text>
                </TouchableOpacity>
              </View>

              {!isAllDay && (
                <View style={styles.timeInputs}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker('start')}
                  >
                    <Text style={styles.timeButtonText}>
                      Start: {startTime ? startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Select time'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker('end')}
                  >
                    <Text style={styles.timeButtonText}>
                      End: {endTime ? endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Select time'}
                    </Text>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <View style={styles.timePickerContainer}>
                      <Text style={[{ fontSize: 14, fontWeight: '400', color: colors.secondaryText }, { marginBottom: spacing.sm }]}>
                        {showTimePicker === 'start' ? 'Start Time:' : 'End Time:'}
                      </Text>
                      <View style={styles.timePickerWrapper}>
                        <DateTimePicker
                          value={showTimePicker === 'start' ? (startTime || new Date()) : (endTime || new Date())}
                          mode="time"
                          display="spinner"
                          onChange={(event, selectedTime) => {
                            if (selectedTime) {
                              if (showTimePicker === 'start') {
                                setStartTime(selectedTime);
                              } else {
                                setEndTime(selectedTime);
                              }
                            }
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.timePickerDoneButton}
                        onPress={() => setShowTimePicker(null)}
                      >
                        <Text style={styles.timePickerDoneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

               <Text style={[{ fontSize: 14, fontWeight: '400', color: colors.secondaryText }, { marginTop: spacing.md }]}>Recurrence:</Text>
             <View style={styles.recurrenceOptions}>
               {(['none', 'daily', 'weekly', 'biweekly', 'monthly', 'yearly'] as RecurrenceType[]).map((type) => (
                 <TouchableOpacity
                   key={type}
                   style={[
                     styles.recurrenceButton,
                     recurrenceType === type && styles.recurrenceButtonSelected,
                   ]}
                   onPress={() => setRecurrenceType(type)}
                 >
                   <Text style={[
                     styles.recurrenceButtonText,
                     recurrenceType === type && styles.recurrenceButtonTextSelected,
                   ]}>
                     {type.charAt(0).toUpperCase() + type.slice(1)}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>
                {recurrenceType !== 'none' && (
                  <View style={{ marginBottom: spacing.lg }}>
                    {showDatePicker ? (
                      <View>
                         <Text style={[{ fontSize: 14, fontWeight: '400', color: colors.secondaryText }, { marginBottom: spacing.sm }]}>End Date:</Text>
                        <DateTimePicker
                          value={recurrenceEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                          mode="date"
                          display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate && selectedDate >= selectedDate) {
                            setRecurrenceEndDate(selectedDate);
                          }
                        }}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <Text style={styles.datePickerText}>
                          {recurrenceEndDate ? recurrenceEndDate.toDateString() : 'Select end date (optional)'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
             <View style={styles.modalButtons}>
               <TouchableOpacity
                 style={styles.secondaryButton}
                 onPress={() => setModalVisible(false)}
               >
                  <Text style={{ fontSize: 16, fontWeight: '400', color: colors.primaryText }}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 style={styles.primaryButton}
                 onPress={addEvent}
               >
                 <Text style={styles.primaryButtonText}>Add</Text>
               </TouchableOpacity>
             </View>
             </View>
           </TouchableWithoutFeedback>
         </View>
       </Modal>



      </SafeAreaView>
   );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
   header: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingHorizontal: spacing.screenPadding,
     paddingVertical: spacing.md,
     borderBottomWidth: 1,
     borderBottomColor: colors.borders,
     backgroundColor: colors.background,
   },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.small,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borders,
    alignItems: 'center',
    justifyContent: 'center',
  },
   navButtonText: {
     fontSize: 20,
     fontWeight: '600',
     color: colors.primaryText,
   },
   weekdays: {
     flexDirection: 'row',
     paddingHorizontal: spacing.screenPadding,
     paddingVertical: spacing.md,
     borderBottomWidth: 1,
     borderBottomColor: colors.borders,
   },
   weekdayText: {
     fontSize: 14,
     fontWeight: '400',
     color: colors.secondaryText,
     flex: 1,
     textAlign: 'center',
   },
     calendar: {
       justifyContent: 'center',
       alignItems: 'center',
     },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing.screenPadding,
      paddingVertical: spacing.md,
    },
    dayCell: {
      width: `${100/7}%`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
   dayContent: {
     alignItems: 'center',
   },
    eventIndicator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primaryText,
      marginTop: 2,
    },
    timedEventIndicator: {
      width: 6,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primaryText,
      marginTop: 2,
    },
   dayText: {
     fontSize: 16,
     fontWeight: '400',
     color: colors.primaryText,
   },
   todayCell: {
     borderWidth: 1,
     borderColor: colors.accent,
     borderRadius: borderRadius.small,
   },
   todayText: {
     fontWeight: '600',
   },
   selectedCell: {
     backgroundColor: colors.primaryText,
     borderRadius: 4,
   },
   selectedText: {
     color: colors.surface,
     fontWeight: '600',
   },
    selectedDateInfo: {
      padding: spacing.screenPadding,
      borderTopWidth: 1,
      borderTopColor: colors.borders,
      minHeight: 60,
    },
     eventItem: {
       flexDirection: 'row',
       alignItems: 'flex-start',
       marginTop: spacing.xs,
     },
     eventBullet: {
       fontSize: 14,
       fontWeight: '400',
       color: colors.secondaryText,
       marginRight: spacing.xs,
       lineHeight: 20,
     },
     eventContent: {
       flex: 1,
     },
     eventText: {
       fontSize: 14,
       fontWeight: '400',
       color: colors.secondaryText,
       lineHeight: 20,
     },
   fab: {
     position: 'absolute',
     right: spacing.screenPadding,
     bottom: spacing.screenPadding + 34, // Account for home indicator
     width: 56,
     height: 56,
     borderRadius: 28,
     backgroundColor: colors.primaryText,
     alignItems: 'center',
     justifyContent: 'center',
     shadowColor: colors.primaryText,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.3,
     shadowRadius: 4,
     elevation: 5,
   },
    fabText: {
      fontSize: 24,
      color: colors.background,
      fontWeight: '600',
    },
   modalOverlay: {
     flex: 1,
     backgroundColor: 'rgba(0, 0, 0, 0.85)',
     justifyContent: 'center',
     alignItems: 'center',
   },
   modalContent: {
     backgroundColor: colors.background,
     borderWidth: 1,
     borderColor: colors.borders,
     borderRadius: borderRadius.medium,
     padding: spacing.screenPadding,
     width: '80%',
     maxWidth: 400,
   },
     input: {
       backgroundColor: colors.background,
       borderWidth: 1,
       borderColor: colors.borders,
       borderRadius: borderRadius.small,
       padding: spacing.inputPadding,
       fontSize: 16,
       color: colors.primaryText,
       marginTop: spacing.md,
       marginBottom: spacing.md,
     },
    datePickerButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borders,
      borderRadius: borderRadius.small,
      padding: spacing.inputPadding,
      marginTop: spacing.md,
      marginBottom: spacing.md,
    },
     datePickerText: {
       fontSize: 16,
       color: colors.primaryText,
     },
   modalButtons: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   secondaryButton: {
     backgroundColor: colors.background,
     borderWidth: 1,
     borderColor: colors.borders,
     borderRadius: borderRadius.small,
     padding: spacing.md,
     alignItems: 'center',
     flex: 1,
     marginRight: spacing.sm,
   },
   primaryButton: {
     backgroundColor: colors.primaryText,
     borderRadius: borderRadius.small,
     padding: spacing.md,
     alignItems: 'center',
     flex: 1,
     marginLeft: spacing.sm,
   },
     primaryButtonText: {
       color: colors.background,
       fontSize: 16,
       fontWeight: '500',
     },
    recurrenceOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    recurrenceButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borders,
      borderRadius: borderRadius.small,
      padding: spacing.sm,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
    },
    recurrenceButtonSelected: {
      backgroundColor: colors.primaryText,
      borderColor: colors.primaryText,
    },
     recurrenceButtonText: {
       fontSize: 14,
       fontWeight: '400',
       color: colors.primaryText,
     },
     recurrenceButtonTextSelected: {
       color: colors.background,
     },
     allDayToggle: {
       flexDirection: 'row',
       marginTop: spacing.md,
       marginBottom: spacing.md,
       borderWidth: 1,
       borderColor: colors.borders,
       borderRadius: borderRadius.small,
       overflow: 'hidden',
     },
     toggleButton: {
       flex: 1,
       padding: spacing.sm,
       alignItems: 'center',
       backgroundColor: colors.surface,
     },
     toggleButtonSelected: {
       backgroundColor: colors.primaryText,
     },
     toggleText: {
       fontSize: 14,
       fontWeight: '400',
       color: colors.primaryText,
     },
     toggleTextSelected: {
       color: colors.background,
     },
     timeInputs: {
       marginTop: spacing.sm,
       marginBottom: spacing.md,
     },
     timeButton: {
       backgroundColor: colors.background,
       borderWidth: 1,
       borderColor: colors.borders,
       borderRadius: borderRadius.small,
       padding: spacing.inputPadding,
       marginBottom: spacing.sm,
     },
     timeButtonText: {
       fontSize: 16,
       color: colors.primaryText,
     },
     timePickerContainer: {
       marginTop: spacing.md,
       marginBottom: spacing.md,
       padding: spacing.sm,
       backgroundColor: colors.surface,
       borderWidth: 1,
       borderColor: colors.borders,
       borderRadius: borderRadius.small,
       overflow: 'hidden',
     },
     timePickerWrapper: {
       marginBottom: spacing.sm,
       alignItems: 'center',
     },
     timePickerDoneButton: {
       backgroundColor: colors.primaryText,
       borderRadius: borderRadius.small,
       padding: spacing.sm,
       alignItems: 'center',
     },
     timePickerDoneText: {
       color: colors.background,
       fontSize: 16,
       fontWeight: '500',
     },


   });

export default CalendarScreen;