import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import api, { setAuthToken } from '../api/axiosConfig';

interface LoginValues {
  email: string;
  password: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
}

const useAuth = (setLoading: (loading: boolean) => void, navigation: any) => {
  const handleLogin = async (values: LoginValues) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/login', values);
      const { accessToken } = response.data;
      if (!accessToken) {
        throw new Error('Invalid response from server: Missing accessToken');
      }

      const decoded: JwtPayload = jwtDecode(accessToken);
      const userId = decoded.userId;
      if (!userId) {
        throw new Error('Invalid JWT: Missing userId');
      }

      await AsyncStorage.setItem('authToken', accessToken);
      await AsyncStorage.setItem('userId', userId);

      setAuthToken(accessToken);
      navigation.navigate('ContactList');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
      } else {
        console.error('Login error:', error);
      }
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      Alert.alert('Login failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin };
};

export default useAuth;
