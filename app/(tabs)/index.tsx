import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Witamy!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.mainContainer}>
        <ThemedText>Poczytaj biblie (epub.js):</ThemedText>
        <TouchableOpacity onPress={() => router.push("/bible")}>
          <Image style={styles.bookThumbnail} source="https://www.gutenberg.org/cache/epub/60793/pg60793.cover.medium.jpg" />
        </TouchableOpacity>
        <ThemedText>Poczytaj biblie (xhtml):</ThemedText>
        <TouchableOpacity onPress={() => router.push("/xhtml")}>
          <Image style={styles.bookThumbnail} source="https://www.gutenberg.org/cache/epub/60793/pg60793.cover.medium.jpg" />
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  bookThumbnail: {
    width: 150,
    height: 200,
    marginLeft: "auto",
    marginRight: "auto"
  }
});
