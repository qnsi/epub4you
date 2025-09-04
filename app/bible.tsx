import { Linking, SafeAreaView } from 'react-native';
import { Reader, Themes, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system'; // for Expo project
import { readerTheme } from '@/styles/readerTheme';


const Bible = () => {

  const { goToLocation } = useReader();


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Reader
        src={"https://www.gutenberg.org/cache/epub/60793/pg60793-images-3.epub"}
        fileSystem={useFileSystem}
        onPressExternalLink={(url) => {
          console.log("opening link: ", url)
          Linking.openURL(url);
        }}
        defaultTheme={Themes.LIGHT}
      />
    </SafeAreaView>
  );
}

export default Bible
