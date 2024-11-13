import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactListScreen from './src/screens/ContactListScreen';
import AddEditContactScreen from './src/screens/AddEditContactScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import UserDetailScreen from './src/screens/UserDetailScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="ContactList"
          component={ContactListScreen}
          options={{ title: 'Contact List' }}
        />
        <Stack.Screen
          name="AddEditContact"
          component={AddEditContactScreen}
          options={{ title: 'Add / Edit Contact' }}
        />
        <Stack.Screen
          name="ContactDetail"
          component={ContactDetailScreen}
        />
        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={{ title: 'User Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
