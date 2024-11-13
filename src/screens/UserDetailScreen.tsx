import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

const UserDetailScreen = ({ navigation }: Props) => {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null>(null);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get('https://yourapi.com/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Login');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          {userData.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{userData.name[0]}</Text>
            </View>
          )}
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          <Text style={styles.phone}>{userData.phone}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: { fontSize: 40, color: '#000' },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 18, color: 'gray' },
  phone: { fontSize: 18, color: 'gray' },
});

export default UserDetailScreen;
