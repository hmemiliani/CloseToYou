import React, { useState } from 'react';
import { Alert } from 'react-native';
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';

const useSyncContacts = () => {
  const [syncing, setSyncing] = useState(false);

  const syncContacts = async () => {
    if (syncing) return;

    setSyncing(true);

    try {
      const permission = await Contacts.requestPermission();
      if (permission !== 'authorized') {
        Alert.alert('Permission Denied', 'Access to contacts was denied.');
        setSyncing(false);
        return;
      }

      const deviceContacts = await Contacts.getAll();

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      for (const contact of deviceContacts) {
        const { givenName, familyName, phoneNumbers, emailAddresses } = contact;
        const name = `${givenName || ''} ${familyName || ''}`.trim();
        const phone = phoneNumbers[0]?.number || null;
        const email = emailAddresses[0]?.email || null;

        if (!name || !phone) continue;

        const payload = {
          name,
          phone,
          email,
          latitude: 4.60971,
          longitude: -74.08175,
        };

        try {
          await api.post('/contacts', payload);
        } catch (error) {
          console.log(`Error syncing contact ${name}:`, error);
        }
      }

      Alert.alert('Sync Complete', 'Contacts have been successfully synced.');
    } catch (error) {
      console.error('Error syncing contacts:', error);
      Alert.alert('Error', 'Failed to sync contacts.');
    } finally {
      setSyncing(false);
    }
  };

  return { syncContacts, syncing };
};

export default useSyncContacts;
