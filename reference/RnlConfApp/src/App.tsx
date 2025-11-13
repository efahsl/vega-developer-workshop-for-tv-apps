/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React from 'react';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import {createNativeStackNavigator} from '@amazon-devices/react-navigation__native-stack';
import {NavigationContainer} from '@amazon-devices/react-navigation__native';
import {HomeScreen} from './screens/HomeScreen';
import {DetailsScreen} from './screens/DetailsScreen';
import {VideoPlayerScreen} from './screens/VideoPlayerScreen';
import {BlitsDemoScreen} from './screens/BlitsDemoScreen';

// Enable optimizations
enableScreens();
enableFreeze();

// Define navigation types
export type RootStackParamList = {
  Home: undefined;
  Detail: {
    bannerImage: string;
    title: string;
    description: string;
    videoUrl: string;
  };
  VideoPlayer: {
    videoUrl: string;
    title: string;
  };
  BlitsDemo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailsScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Stack.Screen name="BlitsDemo" component={BlitsDemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
