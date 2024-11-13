import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const response = await axios.post('https://yourapi.com/login', { email, password });
    const token = response.data.token;
    await AsyncStorage.setItem('authToken', token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
  };

  const getAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
  };

  return { login, logout, getAuthToken };
};
