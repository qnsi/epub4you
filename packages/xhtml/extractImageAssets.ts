import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';

export interface ImageAssets {
  [key: string]: string; // filename -> base64 data URL
}

export const extractImageAssets = async (epubZip: JSZip): Promise<ImageAssets> => {
  const imageAssets: ImageAssets = {};

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

  for (const [fileName, file] of Object.entries(epubZip.files)) {
    if (!file.dir) {
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));

      if (imageExtensions.includes(extension)) {
        try {
          const imageBase64 = await file.async('base64');

          let mimeType = 'image/jpeg';
          if (extension === '.png') mimeType = 'image/png';
          else if (extension === '.gif') mimeType = 'image/gif';
          else if (extension === '.svg') mimeType = 'image/svg+xml';
          else if (extension === '.webp') mimeType = 'image/webp';

          const dataUrl = `data:${mimeType};base64,${imageBase64}`;

          const baseFileName = fileName.split('/').pop() || fileName;
          imageAssets[baseFileName] = dataUrl;

          imageAssets[fileName] = dataUrl;

        } catch (error) {
          console.error(`Error processing image ${fileName}:`, error);
        }
      }
    }
  }

  return imageAssets;
};
