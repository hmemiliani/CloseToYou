import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useProfileImage } from '../hooks/useProfileImage';
import { useContacts } from '../hooks/useContacts';
import { useLocation } from '../hooks/useLocation';
import MapView, { Marker, MapPressEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditContact'>;

const AddEditContactScreen = ({ route, navigation }: Props) => {
  const { addOrUpdateContact, selectTag, tag } = useContacts();
  const { profileImage, takePhoto, pickImageFromGallery, setProfileImage } = useProfileImage();
  const { location, selectLocation } = useLocation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (route.params?.contact) {
      const { contact } = route.params;
      setName(contact.name || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
      setProfileImage(contact.profileImage || undefined);
      selectTag(contact.tag || 'Client');
      if (contact.location) {selectLocation(contact.location.latitude, contact.location.longitude);}
    }
  }, [route.params, selectLocation, selectTag, setProfileImage]);

  const handleSave = async () => {
    const contact = {
      id: route.params?.contactId || Date.now().toString(),
      name,
      phone,
      email,
      profileImage,
      tag,
      location: location ?? undefined,
    };
    await addOrUpdateContact(contact);
    navigation.navigate('ContactList', { newContact: contact });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <TouchableOpacity onPress={pickImageFromGallery}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.currentAvatar}><Icon name="image" size={50} color="#FFF" /></Text>
            </View>
          )}
        </TouchableOpacity>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>

      <Text style={styles.label}>Contact Type:</Text>
      <View style={styles.tagContainer}>
        <TouchableOpacity onPress={() => selectTag('Client')}>
          <Text style={[styles.tagOption, tag === 'Client' && styles.selectedTag]}>Client</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => selectTag('Employee')}>
          <Text style={[styles.tagOption, tag === 'Employee' && styles.selectedTag]}>Employee</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />

      {location ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location?.latitude || 37.78825,
            longitude: location?.longitude || -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={() => console.log('Map is ready')}
          onPress={(e: MapPressEvent) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            selectLocation(latitude, longitude);
          }}
        >
          {location && <Marker coordinate={location} />}
        </MapView>
      ) : (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </>
      )}

      <Button title="Save Contact" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, display: 'flex' },
  imgContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  currentAvatar: { fontSize: 50 },
  placeholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 10 },
  label: { fontSize: 16, marginBottom: 10 },
  tagContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  tagOption: { fontSize: 16, padding: 10, color: 'grey' },
  selectedTag: { fontWeight: 'bold', color: 'blue' },
  map: { height: 200, marginVertical: 20 },
  loadingText: { textAlign: 'center', margin: 10, color: 'gray' },
});

export default AddEditContactScreen;
