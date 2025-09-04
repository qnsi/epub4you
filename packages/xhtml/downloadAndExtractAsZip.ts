import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { extractImageAssets } from './extractImageAssets';

export const downloadAndExtractAsZip = async (epubUrl: string) => {
  try {
    const fileName = 'book.epub';
    const epubPath = `${FileSystem.documentDirectory}${fileName}`;

    console.log('Downloading EPUB...');
    const downloadResult = await FileSystem.downloadAsync(epubUrl, epubPath);

    if (downloadResult.status !== 200) {
      throw new Error('Download failed');
    }

    const epubBase64 = await FileSystem.readAsStringAsync(epubPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const zip = new JSZip();
    const epubZip = await zip.loadAsync(epubBase64, { base64: true });

    const extractedFiles = {};
    const imageAssets = await extractImageAssets(epubZip);

    for (const [fileName, file] of Object.entries(epubZip.files)) {
      if (!file.dir) {
        const content = await file.async('string');
        extractedFiles[fileName] = content;
      }
    }

    return { extractedFiles, imageAssets };

  } catch (error) {
    console.error('Error extracting EPUB:', error);
    throw error;
  }
};
