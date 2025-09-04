import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { Alert, StyleSheet } from 'react-native';
import { readiumHTML } from '@/packages/readium/html';
import { useRef, useState } from 'react';

export default function App() {

  const webViewRef = useRef<WebView>(null);
  const [isReaderReady, setIsReaderReady] = useState(false);

  const sendCommand = (command: any) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(command));
    }
  };

  const loadEpub = (url: string) => {
    sendCommand({
      type: 'LOAD_EPUB',
      url: url
    });
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'READER_READY':
          setIsReaderReady(true);
          // onReady?.();
          // Auto-load EPUB when reader is ready
          loadEpub('https://www.gutenberg.org/cache/epub/60793/pg60793-images-3.epub');
          break;

        case 'EPUB_LOADED':
          console.log('EPUB loaded successfully');
          break;

        case 'LOCATION_CHANGED':
          // onLocationChanged?.(data.location);
          break;

        case 'TEXT_SELECTED':
          // onTextSelected?.(data.text);
          break;

        case 'ERROR':
          Alert.alert('Reader Error', data.message);
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
    }
  };
  return (
    <WebView
      ref={webViewRef}
      source={{ html: readiumHTML }}
      style={styles.container}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      originWhitelist={['*']}
      mixedContentMode="compatibility"
      onError={(error) => {
        console.error('WebView error:', error);
      }}
      onHttpError={(error) => {
        console.error('WebView HTTP error:', error);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
