import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Contact, RootStackParamList } from '../types/navigation';
import { useContacts } from '../hooks/useContacts';

type ContactListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactList'>;

const ContactListScreen = () => {
  const navigation = useNavigation<ContactListScreenNavigationProp>();
  const { contacts, loadContacts } = useContacts();

  useFocusEffect(
    React.useCallback(() => {
      loadContacts();
    }, [])
  );

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetail', { contact: item })}
    >
      <View style={styles.infoContactContainer}>
        {item.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{item.name ? item.name[0] : '?'}</Text>
          </View>
        )}
        <View style={styles.InfoContainer}>
          <View style={styles.contactContainer}>
            <Text style={styles.contactName}>{item.name}</Text>
          </View>
          <View>
            {item.contactType ? (
              <Text style={styles.contactTag}>{item.contactType}</Text>
            ) : (
              <Text style={styles.contactTag}>No-Tag</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={contacts} keyExtractor={(item) => item.id} renderItem={renderItem} />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditContact', { contactId: undefined })}
      >
        <Text style={styles.addButtonText}>+ Add Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    color: '#000',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginLeft: 15,
  },
  InfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignItems: 'center',
  },
  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginLeft: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  contactName: {
    fontSize: 18,
    color: '#000',
  },
  contactInfo: {
    color: '#000',
  },
  contactTag: {
    backgroundColor: '#c7c7c7',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    width: 70,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    margin: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactListScreen;
