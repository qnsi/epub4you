import { ImageAssets } from "./extractImageAssets";

export const replaceImagesInXHTML = (content: string, imageAssets: ImageAssets) => {
  let processedContent = content;

  // Find all img tags
  const imgRegex = /<img\s+([^>]*?)src\s*=\s*["']([^"']+)["']([^>]*?)>/gi;

  processedContent = processedContent.replace(imgRegex, (match, beforeSrc, srcValue, afterSrc) => {
    // Try different ways to match the image
    let imageDataUrl = null;

    // 1. Try exact filename match
    if (imageAssets[srcValue]) {
      imageDataUrl = imageAssets[srcValue];
    }

    // 2. Try with OEBPS prefix (common in EPUBs)
    else if (imageAssets[`OEBPS/${srcValue}`]) {
      imageDataUrl = imageAssets[`OEBPS/${srcValue}`];
    }

    // 3. Try finding by filename only
    else {
      const fileName = srcValue.split('/').pop();
      if (fileName && imageAssets[fileName]) {
        imageDataUrl = imageAssets[fileName];
      }
    }

    if (imageDataUrl) {
      console.log(`Replaced image: ${srcValue} -> data URL`);
      return `<img ${beforeSrc}src="${imageDataUrl}"${afterSrc}>`;
    } else {
      console.warn(`Image not found: ${srcValue}`);
      // Keep original src but add error handling
      return `<img ${beforeSrc}src="${srcValue}" onerror="this.style.display='none'"${afterSrc}>`;
    }
  });

  return processedContent;
};
