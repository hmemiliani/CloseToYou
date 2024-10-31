import { useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  const takePhoto = async () => {
    const response = await launchCamera({ mediaType: 'photo', saveToPhotos: true });
    if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      console.log('Image URI from camera:', uri);
      setProfileImage(uri);
    }
  };

  const pickImageFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        console.log('Image URI from gallery:', uri);
        setProfileImage(uri);
      }
    });
  };

  return {
    profileImage,
    takePhoto,
    pickImageFromGallery,
    setProfileImage,
  };
};
