import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Contact } from '../types/navigation';


export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get('https://yourapi.com/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const addOrUpdateContact = async (contact: Contact) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (contact.id) {
        // Si existe `contact.id`, actualiza el contacto
        await axios.put(`https://yourapi.com/contacts/${contact.id}`, contact, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Si no existe `contact.id`, crea un nuevo contacto
        await axios.post('https://yourapi.com/contacts', contact, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      loadContacts(); // Recarga los contactos después de agregar/actualizar
    } catch (error) {
      console.error('Failed to add/update contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.delete(`https://yourapi.com/contacts/${contactId}`, {
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

  return { contacts, loadContacts, addOrUpdateContact, deleteContact };
};
