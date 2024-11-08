import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ContactListScreen from './src/screens/ContactListScreen';
import AddEditContactScreen from './src/screens/AddEditContactScreen';
import {RootStackParamList} from './src/types/navigation';
import ContactDetailScreen from './src/screens/ContactDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ContactList">
        <Stack.Screen
          name="ContactList"
          component={ContactListScreen}
          options={{title: 'Contact List'}}
        />
        <Stack.Screen
          name="AddEditContact"
          component={AddEditContactScreen}
          options={{title: 'Add / Edit Contact'}}
        />
        <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
