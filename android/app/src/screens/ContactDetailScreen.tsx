import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContacts } from '../hooks/useContacts';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactDetail'>;

const ContactDetailScreen = ({ route, navigation }: Props) => {
  const { deleteContact } = useContacts();
  const { contact } = route.params;

  const handleDelete = () => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteContact(contact.id);
            navigation.navigate('ContactList', { contactIdToDelete: contact.id });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {contact.profileImage ? (
        <Image source={{ uri: contact.profileImage }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{contact.name ? contact.name[0] : "?"}</Text>
        </View>
      )}
      <Text style={styles.contactName}>{contact.name}</Text>
      <Text style={styles.contactInfo}>📞 {contact.phone}</Text>
      <Text style={styles.contactInfo}>✉️ {contact.email}</Text>
      <Text style={styles.contactTag}>Type: {contact.tag}</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditContact', { contactId: contact.id, contact })}
        >
          <Icon name="edit" size={30} color="#007BFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Icon name="trash" size={30} color="red" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  profileImage: { width: 150, height: 150, marginBottom: 20, borderRadius: 10 },
  placeholder: { width: 150, height: 150, borderRadius: 10, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 80, fontWeight: 'bold', color: '#000' },
  contactName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  contactInfo: { fontSize: 18, marginBottom: 10 },
  contactTag: { fontSize: 16, fontStyle: 'italic', marginVertical: 10, color: 'gray' },
  actionsContainer: { flexDirection: 'row', marginTop: 30 },
  actionButton: { alignItems: 'center', marginHorizontal: 20 },
  buttonText: { fontSize: 14, marginTop: 5 },
});

export default ContactDetailScreen;
