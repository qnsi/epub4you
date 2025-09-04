import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { EpubChapter, parseEpubStructure } from '@/packages/xhtml/parseEpubStructure';
import { downloadAndExtractAsZip } from '@/packages/xhtml/downloadAndExtractAsZip';
import XHTMLViewer from '@/packages/xhtml/XHTMLViewer';
import { ImageAssets } from '@/packages/xhtml/extractImageAssets';

const EpubReader: React.FC = () => {
  const [chapters, setChapters] = useState<EpubChapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<EpubChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [images, setImageAssets] = useState<ImageAssets>()

  const epubUrl = 'https://www.gutenberg.org/cache/epub/60793/pg60793-images-3.epub';

  useEffect(() => {
    loadEpub();
  }, []);

  const loadEpub = async () => {
    try {
      setLoading(true);

      const { extractedFiles, imageAssets } = await downloadAndExtractAsZip(epubUrl);
      setImageAssets(imageAssets)
      console.log("ExtractedFiles: ", Object.keys(extractedFiles))

      const parsedChapters = parseEpubStructure(extractedFiles);

      setChapters(parsedChapters);

      if (parsedChapters.length > 0) {
        setCurrentChapter(parsedChapters[0]);
      }

    } catch (error) {
      console.error('Failed to load EPUB:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChapterItem = ({ item, index }: { item: EpubChapter; index: number }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => {
        setCurrentChapter(item);
        setShowTOC(false);
      }}
    >
      <Text style={styles.chapterTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading EPUB...</Text>
      </View>
    );
  }

  if (showTOC) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowTOC(false)}
        >
          <Text style={styles.backButtonText}>← Back to Reading</Text>
        </TouchableOpacity>

        <FlatList
          data={chapters}
          renderItem={renderChapterItem}
          keyExtractor={(item) => item.id}
          style={styles.chapterList}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tocButton}
        onPress={() => setShowTOC(true)}
      >
        <Text style={styles.tocButtonText}>Table of Contents</Text>
      </TouchableOpacity>

      {currentChapter && images && (
        <XHTMLViewer chapter={currentChapter} imageAssets={images} />
      )}

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id);
            if (currentIndex > 0) {
              setCurrentChapter(chapters[currentIndex - 1]);
            }
          }}
          disabled={chapters.findIndex(ch => ch.id === currentChapter?.id) === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id);
            if (currentIndex < chapters.length - 1) {
              setCurrentChapter(chapters[currentIndex + 1]);
            }
          }}
          disabled={chapters.findIndex(ch => ch.id === currentChapter?.id) === chapters.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tocButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  tocButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  chapterList: {
    flex: 1,
  },
  chapterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chapterTitle: {
    fontSize: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EpubReader;
