import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../api/axiosConfig';

interface LoginValues {
  email: string;
  password: string;
}

const useAuth = (setLoading: (loading: boolean) => void, navigation: any) => {
  const handleLogin = async (values: LoginValues) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', values);
      const { accessToken } = response.data;
      console.log(accessToken);
      
      await AsyncStorage.setItem('authToken', accessToken);
      setAuthToken(accessToken);
      navigation.navigate('ContactList');
    } catch (error) {
      console.log(error);
      Alert.alert('Login failed', 'Invalid credentials');
    } finally {
      setLoading(false); // Detiene el indicador de carga
    }
  };

  return { handleLogin };
};

export default useAuth;
