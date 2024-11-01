import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          'Permiso denegado',
          'La aplicación necesita permisos de ubicación para mostrar el mapa correctamente.'
        );
        return false;
      }
    } catch (error) {
      console.error('Error al solicitar permisos de ubicación:', error);
      return false;
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        Alert.alert('Error al obtener la ubicación', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    (async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getLocation();
      }
    })();
  }, []);

  const selectLocation = (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude });
  };

  return {
    location,
    selectLocation,
  };
};
