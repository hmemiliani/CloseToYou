import { useState, useEffect } from 'react';
import axios from 'axios';
import { WEATHER_API_KEY } from '@env';

type WeatherData = {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
};

export const useWeather = (latitude?: number, longitude?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get<WeatherData>(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              lat: latitude,
              lon: longitude,
              appid: WEATHER_API_KEY,
              units: 'metric',
            },
          }
        );
        setWeather(response.data);
      } catch (err) {
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  return { weather, loading, error };
};
