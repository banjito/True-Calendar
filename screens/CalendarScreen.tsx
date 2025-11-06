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
import DateTimePicker from '@react-native-community/datetimepicker';



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
  const [showDatePicker, setShowDatePicker] = useState(false);

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
           <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primaryText }}>
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
            <Text style={{ fontSize: 16, fontWeight: '400', color: colors.primaryText }}>
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
    borderRadius: borderRadius.small,
  },
   selectedText: {
     color: colors.surface,
     fontWeight: '600',
   },
   selectedDateInfo: {
     padding: spacing.screenPadding,
     borderTopWidth: 1,
     borderTopColor: colors.borders,
   },
    eventText: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.secondaryText,
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


  });

export default CalendarScreen;