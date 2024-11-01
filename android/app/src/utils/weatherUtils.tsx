import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export const getWeatherIcon = (description: string) => {
  switch (true) {
    case /clear|sunny/i.test(description):
      return <Icon name="sun-o" size={20} color="#FFD700" />;
    case /cloud/i.test(description):
      return <Icon name="cloud" size={20} color="#A9A9A9" />;
    case /rain|drizzle|light rain/i.test(description):
      return <Icon name="cloud-rain" size={20} color="#1E90FF" />;
    case /thunderstorm|storm/i.test(description):
      return <Icon name="bolt" size={20} color="#FF4500" />;
    case /snow/i.test(description):
      return <Icon name="snowflake-o" size={20} color="#00BFFF" />;
    case /mist|fog|haze/i.test(description):
      return <Icon name="smog" size={20} color="#778899" />;
    default:
      return <Icon name="cloud" size={20} color="#A9A9A9" />;
  }
};
