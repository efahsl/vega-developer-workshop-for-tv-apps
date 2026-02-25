/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

// Import the required components from react and react-native packages
import React from 'react';
import {useRef, useEffect, useState, useMemo} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import type {NativeStackNavigationProp} from '@amazon-devices/react-native-screens/native-stack';
import type {RootStackParamList} from '../App';

// Import VideoPlayer component from @amazon-devices/react-native-w3cmedia NPM package.
import {
  VideoPlayer,
  KeplerVideoView,
} from '@amazon-devices/react-native-w3cmedia';

type VideoPlayerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VideoPlayer'
>;

interface VideoPlayerScreenProps {
  route: {
    params: {
      videoUrl: string;
      title: string;
    };
  };
  navigation: VideoPlayerScreenNavigationProp;
}

export const VideoPlayerScreen = ({
  route,
  navigation,
}: VideoPlayerScreenProps) => {
  const {videoUrl, title} = route.params;

  // Declare a reference to video component
  const video = useRef<VideoPlayer | null>(null);
  const [useKeplerVideoView, setUseKeplerVideoView] = useState(false);

  useEffect(() => {
    console.log('VideoPlayerScreen mounting');
    console.log('Playing video:', title);
    console.log('Video URL:', videoUrl);
    initializingPreBuffering();

    // Handle app state changes to prevent crash when going to background
    const handleAppStateChange = (nextAppState: string) => {
      console.log('App state changed to:', nextAppState);

      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('App going to background, pausing video to prevent crash');
        if (video.current) {
          video.current.pause();
        }
      }
    };

    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup function - pause and cleanup video when navigating away
    return () => {
      console.log('VideoPlayerScreen unmounting, pausing video');

      // Remove app state listener
      appStateSubscription?.remove();

      if (video.current) {
        // Remove event listener
        video.current.removeEventListener('ended', handleVideoEnded);
        video.current.pause();
        // Optional: Reset to beginning
        video.current.currentTime = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoEnded = () => {
    console.log('Video playback ended, navigating back');
    navigation.goBack();
  };

  const initializingPreBuffering = async () => {
    video.current = new VideoPlayer();
    await video.current.initialize();
    video.current!.autoplay = false;
    video.current.src = videoUrl; // set HTMLMediaElement's src attribute
    // video.current.src =
    //   'https://emf-sandbox.s3.us-west-2.amazonaws.com/videosamples/appointment-delayed/movie_720p.mp4';

    // Add event listener for when video ends
    video.current.addEventListener('ended', handleVideoEnded);

    setUseKeplerVideoView(true);
    console.log(
      'VideoPlayerScreen init complete, setting kepler video view to true',
    );
  };

  // Memoize the KeplerVideoView to prevent unnecessary re-renders
  const videoView = useMemo(() => {
    if (!useKeplerVideoView || !video.current) {
      return null;
    }
    return (
      <KeplerVideoView
        showControls={false}
        videoPlayer={video.current as VideoPlayer}
      />
    );
  }, [useKeplerVideoView]);

  // Add KeplerVideoView component to the render tree
  return <View style={styles.container}>{videoView}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
