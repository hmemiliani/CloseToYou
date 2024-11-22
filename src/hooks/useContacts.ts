import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { uploadImage } from '../api/axiosConfig';
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
      phone: number;
      contactType: 'Client' | 'Employee';
      latitude: number | null;
      longitude: number | null;
      profilePicture: string | null;
      id?: string;
    },
    file?: any
  ) => {
    try {

      if (file) {
        const uploadedImageUrl = await uploadImage(file);
        if (!uploadedImageUrl) {
          console.error('Image upload failed');
          return;
        }
        contact.profilePicture = uploadedImageUrl;
      }

      if (contact.id) {
        await api.patch(`/contacts/${contact.id}`, contact);
      } else {
        await api.post('/contacts', contact);
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
