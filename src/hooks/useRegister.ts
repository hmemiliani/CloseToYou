import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import api from '../api/axiosConfig';
import { RootStackParamList } from '../types/navigation';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

const useRegister = (navigation: NavigationProp<RootStackParamList>) => {
  const handleRegister = async (values: RegisterValues) => {
    try {
      await api.post('/auth/register', values);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration failed', 'An error occurred');
    }
  };

  return { handleRegister };
};

export default useRegister;
