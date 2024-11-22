import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import ContactListScreen from '../screens/ContactListScreen';
import AddEditContactScreen from '../screens/AddEditContactScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
        //setShowOnboarding(true);
        setShowOnboarding(!onboardingSeen);
      } catch (error) {
        console.error('Error checking onboarding state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={showOnboarding ? 'Onboarding' : 'Auth'}>
      {showOnboarding && (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
          }}
          listeners={{
            focus: async () => {
              await AsyncStorage.setItem('onboardingSeen', 'true');
            },
          }}
        />
      )}
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactList"
        component={ContactListScreen}
        options={({ navigation }) => ({
          title: 'Contacts',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('UserDetail')}
              style={{ marginRight: 15 }}
            >
              <Icon name="user" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddEditContact"
        component={AddEditContactScreen}
        options={{ title: 'Add / Edit Contact' }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{ title: 'User Details' }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
