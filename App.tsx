import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import CalendarScreen from './screens/CalendarScreen';
import { requestNotificationPermissions } from './utils/notifications';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();

    // Handle notification taps
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle notification tap - could navigate to specific event or date
      console.log('Notification tapped:', response);
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}