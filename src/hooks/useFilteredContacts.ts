import { useState, useEffect } from 'react';
import { Contact } from '../types/navigation';

export const useFilteredContacts = (contacts: Contact[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);

  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  return { filteredContacts, setSearchQuery };
};
