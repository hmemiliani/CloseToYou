import React from 'react';
import { Image, StyleSheet} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({ navigation }: any) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace('Auth')}
      onDone={() => navigation.replace('Auth')}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={{ uri: 'http://res.cloudinary.com/djsxw9zeu/image/upload/v1732257386/uploads/j9da7njzaruajip7pkag.jpg' }} style={styles.image} />,
          title: 'Add your Contacts',
          subtitle: 'With CloseToYou, you can conveniently save your clients and employees, as well as record your clients locations so you can visit them whenever you need.',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image source={{ uri: 'http://res.cloudinary.com/djsxw9zeu/image/upload/v1732257447/uploads/ybi1zkgar2rn7koxiyqk.jpg' }} style={styles.image} />,
          title: 'View and Manage your Contacts',
          subtitle: 'You can quickly and conveniently view your contacts details, including all their information, location, and even the weather at their location.',
        },
        {
          backgroundColor: '#e9bcbe',
          image: <Image source={{ uri: 'http://res.cloudinary.com/djsxw9zeu/image/upload/v1732257429/uploads/dmqhkvcqxwhtanezg91x.jpg' }} style={styles.image} />,
          title: 'Contact List',
          subtitle: 'You can view a contact list that loads all the contacts you save, including both clients and employees, to keep them "CloseToYou."',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 500,
    resizeMode: 'contain',
  },
});

export default OnboardingScreen;
