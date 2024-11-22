import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import api from '../api/axiosConfig';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

const UserDetailScreen = ({ navigation }: Props) => {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = async () => {
    try {
      // Obtener el token desde AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const userId = '52f45269-e9f0-4028-98bb-e2096bec53ea';
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('User ID:', userId);
      const response = await api.get(`/users/${userId}`);

      // Actualizar el estado con los datos del usuario
      setUserData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to load user data'
        );
      } else {
        console.error(error);
        Alert.alert('Error', 'Failed to load user data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userId'); // También eliminamos el ID del usuario si se guardó
    navigation.replace('Login');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : userData ? (
        <>
          {userData.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{userData.name ? userData.name[0] : '?'}</Text>
            </View>
          )}
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          <Text style={styles.phone}>{userData.phone}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Error loading user data</Text>
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
