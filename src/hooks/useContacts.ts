import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../types/navigation';

const STORAGE_KEY = '@contacts';

export const useContacts = (route?: any) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tag, setTag] = useState<'Client' | 'Employee' | undefined>(undefined);

  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedContacts !== null) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (e) {
      console.error('Failed to load contacts.', e);
    }
  };

  const saveContacts = async (newContacts: Contact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
    } catch (e) {
      console.error('Failed to save contacts.', e);
    }
  };

  const addOrUpdateContact = (contact: Contact) => {
    setContacts((prevContacts) => {
      const contactExists = prevContacts.some((c) => c.id === contact.id);
      const updatedContacts = contactExists
        ? prevContacts.map((c) => (c.id === contact.id ? contact : c))
        : [...prevContacts, { ...contact, tag }];
      saveContacts(updatedContacts);
      loadContacts();
      return updatedContacts;
    });
  };

  const deleteContact = (contactId: string) => {
    setContacts((prevContacts) => {
      const updatedContacts = prevContacts.filter((contact) => contact.id !== contactId);
      saveContacts(updatedContacts);
      return updatedContacts;
    });
  };

  useEffect(() => {
    if (route?.params?.contactIdToDelete) {
      deleteContact(route.params.contactIdToDelete);
    }
  }, [route?.params?.contactIdToDelete]);

  useEffect(() => {
    loadContacts();
  }, []);

  const selectTag = (selectedTag: 'Client' | 'Employee') => {
    setTag(selectedTag);
  };

  return {
    contacts,
    loadContacts,
    addOrUpdateContact,
    deleteContact,
    tag,
    selectTag,
  };
};
