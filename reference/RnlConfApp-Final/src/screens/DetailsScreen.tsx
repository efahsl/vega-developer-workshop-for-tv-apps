import React, {useState} from 'react';
import {View, Text, StyleSheet, ImageBackground, Pressable} from 'react-native';
import type {NativeStackNavigationProp} from '@amazon-devices/react-native-screens/native-stack';
import type {RootStackParamList} from '../App';

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Detail'
>;

interface DetailsScreenProps {
  route: {
    params: {
      bannerImage: string;
      title: string;
      description: string;
      videoUrl: string;
    };
  };
  navigation: DetailsScreenNavigationProp;
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  isPrimary?: boolean;
  hasTVPreferredFocus?: boolean;
}

const ActionButton = ({label, onPress, isPrimary = false, hasTVPreferredFocus = false}: ButtonProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        focused && styles.buttonFocused,
      ]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}>
      <Text
        style={[
          styles.buttonText,
          isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

export const DetailsScreen = ({route, navigation}: DetailsScreenProps) => {
  const {bannerImage, title, description, videoUrl} = route.params;

  const handlePlay = () => {
    console.log('Play button pressed for:', title);
    console.log('Navigating to VideoPlayer with URL:', videoUrl);
    navigation.navigate('VideoPlayer', {
      videoUrl,
      title,
    });
  };

  const handleAddToWatchlist = () => {
    console.log('Add to watchlist button pressed for:', title);
  };

  return (
    <ImageBackground
      source={{uri: bannerImage}}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonContainer}>
            <ActionButton label="Play" onPress={handlePlay} isPrimary={true} hasTVPreferredFocus={true} />
            <ActionButton
              label="Add to Watchlist"
              onPress={handleAddToWatchlist}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 100,
    paddingLeft: 60,
    paddingRight: 60,
  },
  contentContainer: {
    maxWidth: 800,
  },
  title: {
    fontSize: 72,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 40,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonFocused: {
    borderColor: '#FFFFFF',
    transform: [{scale: 1.05}],
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#000000',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
});
