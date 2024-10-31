import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ContactListScreen from './android/app/src/screens/ContactListScreen';
import AddEditContactScreen from './android/app/src/screens/AddEditContactScreen';
import {RootStackParamList} from './android/app/src/types/navigation';
import ContactDetailScreen from './android/app/src/screens/ContactDetailScreen';

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
