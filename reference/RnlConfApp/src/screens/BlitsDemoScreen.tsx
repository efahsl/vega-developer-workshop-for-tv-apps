import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from '@amazon-devices/webview';

export const BlitsDemoScreen = () => {
  const webRef = useRef(null);

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        hasTVPreferredFocus={true}
        source={{
          uri: 'https://blits-demo.lightningjs.io/',
        }}
        javaScriptEnabled={true}
        onLoadStart={(event) => {
          console.log('BlitsDemo onLoadStart url:', event.nativeEvent.url);
        }}
        onLoad={(event) => {
          console.log('BlitsDemo onLoad url:', event.nativeEvent.url);
        }}
        onError={(event) => {
          console.error('BlitsDemo onError url:', event.nativeEvent.url);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
