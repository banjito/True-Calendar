import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';



import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../styles';

type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

interface Event {
  id: number;
  title: string;
  date: Date;
  recurrence: {
    type: RecurrenceType;
    endDate?: Date;
  };
}

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);

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

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fixed cell height for uniform appearance across screens
  const cellHeight = 80;

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
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
        recurrence: {
          type: recurrenceType,
          endDate: recurrenceEndDate || undefined,
        },
      };
      setEvents(prev => [...prev, newEvent]);
      setEventTitle('');
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
          onPress={() => navigateMonth(-1)}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={typography.headingMedium}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth(1)}
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
                      ]}
                    >
                     {date.getDate()}
                   </Text>
                   {getEventsForDate(date).length > 0 && (
                     <View style={styles.eventIndicator} />
                   )}
                 </View>
               )}
             </TouchableOpacity>
           ))}
         </View>
       </View>

       {selectedDate ? (
         <View style={styles.selectedDateInfo}>
           <Text style={typography.bodyPrimary}>
             Selected: {selectedDate.toDateString()}
           </Text>
           {getEventsForDate(selectedDate).map((event) => (
             <Text key={event.id} style={styles.eventText}>
               • {event.title}{event.recurrence.type !== 'none' ? ' (Recurring)' : ''}
             </Text>
           ))}
         </View>
       ) : null}

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
             <Text style={typography.headingMedium}>Add Event</Text>
             <Text style={typography.bodySecondary}>
               {selectedDate ? selectedDate.toDateString() : new Date().toDateString()}
             </Text>
             <TextInput
               style={styles.input}
               placeholder="Event title"
               placeholderTextColor={colors.secondaryText}
               value={eventTitle}
               onChangeText={setEventTitle}
             />
             <Text style={[typography.bodySecondary, { marginTop: spacing.md }]}>Recurrence:</Text>
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
               <TextInput
                 style={styles.input}
                 placeholder="End date (optional, YYYY-MM-DD)"
                 placeholderTextColor={colors.secondaryText}
                 value={recurrenceEndDate ? recurrenceEndDate.toISOString().split('T')[0] : ''}
                 onChangeText={(text) => {
                   if (text) {
                     const date = new Date(text);
                     if (!isNaN(date.getTime())) {
                       setRecurrenceEndDate(date);
                     }
                   } else {
                     setRecurrenceEndDate(null);
                   }
                 }}
               />
             )}
             <View style={styles.modalButtons}>
               <TouchableOpacity
                 style={styles.secondaryButton}
                 onPress={() => setModalVisible(false)}
               >
                 <Text style={typography.bodyPrimary}>Cancel</Text>
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
    ...typography.headingMedium,
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
    ...typography.bodySecondary,
    flex: 1,
    textAlign: 'center',
  },
    calendar: {
      height: 6 * 80 + 32, // 6 rows * cellHeight + padding
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
  dayText: {
    ...typography.bodyPrimary,
  },
  todayCell: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.small,
  },
  todayText: {
    color: colors.surface,
    fontWeight: typography.semibold,
  },
  selectedCell: {
    backgroundColor: colors.primaryText,
    borderRadius: borderRadius.small,
  },
  selectedText: {
    color: colors.surface,
    fontWeight: typography.semibold,
  },
   selectedDateInfo: {
     padding: spacing.screenPadding,
     borderTopWidth: 1,
     borderTopColor: colors.borders,
   },
   eventText: {
     ...typography.bodySecondary,
     marginTop: spacing.xs,
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
     fontWeight: 'bold',
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
     fontSize: typography.normal,
     color: colors.primaryText,
     marginTop: spacing.md,
     marginBottom: spacing.md,
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
      fontSize: typography.normal,
      fontWeight: typography.medium,
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
      ...typography.bodySecondary,
      color: colors.primaryText,
    },
    recurrenceButtonTextSelected: {
      color: colors.background,
    },


  });

export default CalendarScreen;