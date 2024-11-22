import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContacts } from '../hooks/useContacts';
import MapView, { Marker } from 'react-native-maps';
import { useWeather } from '../hooks/useWeather';
import { getWeatherIcon } from '../utils/weatherUtils';

type RawContact = {
  id: string;
  name: string;
  email: string;
  phone: number;
  contactType: 'Client' | 'Employee';
  latitude?: number;
  longitude?: number;
  profilePicture?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ContactDetail'>;

const ContactDetailScreen = ({ route, navigation }: Props) => {
  const { deleteContact } = useContacts();
  const rawContact: RawContact = route.params.contact;

  // Transformar los datos del contacto
  const contact = {
    ...rawContact,
    location: rawContact.latitude && rawContact.longitude
      ? { latitude: rawContact.latitude, longitude: rawContact.longitude }
      : null,
    profileImage: rawContact.profilePicture,
    tag: rawContact.contactType,
  };

  const { weather, loading, error } = useWeather(
    contact.location?.latitude || 0,
    contact.location?.longitude || 0
  );

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
          <Text style={styles.placeholderText}>{contact.name ? contact.name[0] : '?'}</Text>
        </View>
      )}
      <Text style={styles.contactName}>{contact.name || 'No Name'}</Text>
      <Text style={styles.contactInfo}>📞 {contact.phone || 'No Phone'}</Text>
      <Text style={styles.contactInfo}>✉️ {contact.email || 'No Email'}</Text>
      <Text style={styles.contactTag}>Type: {contact.tag || 'No Type'}</Text>

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

      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : weather ? (
          <View style={styles.weatherContainer}>
            <Icon name="thermometer-half" size={20} color="#333" style={styles.icon} />
            <Text style={styles.weatherText}>{weather.main.temp}°C</Text>
            <Icon name="tint" size={20} color="#333" style={styles.icon} />
            <Text style={styles.weatherText}>{weather.main.humidity}%</Text>
            {getWeatherIcon(weather.weather[0].description)}
            <Text style={styles.weatherText}>{weather.weather[0].description}</Text>
          </View>
        ) : (
          <Text>No weather data available.</Text>
        )}
      </View>

      {contact.location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: contact.location.latitude,
            longitude: contact.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          liteMode
        >
          <Marker coordinate={contact.location} />
        </MapView>
      ) : (
        <Text style={styles.error}>Location not available for this contact.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#000',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  contactInfo: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  contactTag: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 10,
    color: 'gray',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 15,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 14,
    marginTop: 5,
  },
  weatherContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  weatherText: {
    fontSize: 16,
    paddingLeft: 0,
  },
  icon: {
    paddingRight: 0,
  },
  error: {
    color: 'red',
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 30,
  },
});

export default ContactDetailScreen;
