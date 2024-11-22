import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactListScreen from '../screens/ContactListScreen';
import AddEditContactScreen from '../screens/AddEditContactScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';

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
  return (
    <Stack.Navigator initialRouteName="Auth">
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
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('UserDetail')} style={{ marginRight: 15 }}>
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
