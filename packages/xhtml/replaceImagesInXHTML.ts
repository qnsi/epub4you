import { ImageAssets } from "./extractImageAssets";

export const replaceImagesInXHTML = (content: string, imageAssets: ImageAssets) => {
  let processedContent = content;

  const imgRegex = /<img\s+([^>]*?)src\s*=\s*["']([^"']+)["']([^>]*?)>/gi;

  processedContent = processedContent.replace(imgRegex, (match, beforeSrc, srcValue, afterSrc) => {
    let imageDataUrl = null;

    if (imageAssets[srcValue]) {
      imageDataUrl = imageAssets[srcValue];
    }

    else if (imageAssets[`OEBPS/${srcValue}`]) {
      imageDataUrl = imageAssets[`OEBPS/${srcValue}`];
    }

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
      return `<img ${beforeSrc}src="${srcValue}" onerror="this.style.display='none'"${afterSrc}>`;
    }
  });

  return processedContent;
};
