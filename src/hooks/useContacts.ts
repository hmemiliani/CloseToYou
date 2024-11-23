import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import { Contact } from '../types/navigation';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tag, setTag] = useState<'Client' | 'Employee'>('Client');

  const loadContacts = async () => {
    try {
      const response = await api.get('/contacts');

      const transformedContacts = response.data.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        contactType: contact.contactType,
        latitude: contact.latitude || null,
        longitude: contact.longitude || null,
        profilePicture: contact.profilePicture || null,
      }));

      setContacts(transformedContacts);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const selectTag = (newTag: 'Client' | 'Employee') => {
    setTag(newTag);
  };

  const addOrUpdateContact = async (
    contact: {
      name: string;
      email: string;
      phone: string;
      contactType: 'Client' | 'Employee';
      latitude: number | null;
      longitude: number | null;
      id?: string;
    },
    file?: any
  ) => {
    try {
      const formData = new FormData();
      formData.append('name', contact.name);
      formData.append('email', contact.email || '');
      formData.append('phone', contact.phone);
      formData.append('contactType', contact.contactType);
      formData.append('latitude', contact.latitude?.toString() || '');
      formData.append('longitude', contact.longitude?.toString() || '');

      if (file) {
        formData.append('file', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      }

      if (contact.id) {
        await api.patch(`/contacts/${contact.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/contacts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      loadContacts();
    } catch (error) {
      console.error('Failed to add/update contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.delete(`/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return { contacts, loadContacts, addOrUpdateContact, deleteContact, selectTag, tag };
};
