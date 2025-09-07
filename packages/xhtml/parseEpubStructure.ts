import { parseTOC } from "./parseTOC";

export interface EpubChapter {
  id: string;
  title: string;
  href: string;
  content: string;
}

export const parseEpubStructure = (extractedFiles: Record<string, string>): EpubChapter[] => {
  try {
    const opfFile = Object.keys(extractedFiles).find(name =>
      name.endsWith('.opf') || name.includes('content.opf')
    );

    if (!opfFile) {
      throw new Error('OPF file not found');
    }

    const opfContent = extractedFiles[opfFile];
    const opfDir = opfFile.substring(0, opfFile.lastIndexOf('/') + 1);

    const manifestItems = {};
    const manifestRegex = /<item\s+([^>]+)>/g;
    let manifestMatch;

    while ((manifestMatch = manifestRegex.exec(opfContent)) !== null) {
      const attrs = manifestMatch[1];

      const idMatch = attrs.match(/id\s*=\s*["']([^"']+)["']/);
      const hrefMatch = attrs.match(/href\s*=\s*["']([^"']+)["']/);
      const mediaTypeMatch = attrs.match(/media-type\s*=\s*["']([^"']+)["']/);

      if (idMatch && hrefMatch && mediaTypeMatch) {
        manifestItems[idMatch[1]] = {
          href: opfDir + hrefMatch[1],
          mediaType: mediaTypeMatch[1]
        };
      }
    }

    const spineItems = [];
    const spineRegex = /<itemref\s+([^>]+)>/g;
    let spineMatch;

    while ((spineMatch = spineRegex.exec(opfContent)) !== null) {
      const attrs = spineMatch[1];
      const idrefMatch = attrs.match(/idref\s*=\s*["']([^"']+)["']/);

      if (idrefMatch) {
        spineItems.push(idrefMatch[1]);
      }
    }

    const chapters: EpubChapter[] = [];

    spineItems.forEach((itemId, index) => {
      const manifestItem = manifestItems[itemId];

      if (manifestItem && manifestItem.mediaType === 'application/xhtml+xml') {
        const content = extractedFiles[manifestItem.href];

        if (content) {
          const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
          const title = titleMatch ? titleMatch[1] : `Chapter ${index + 1}`;

          chapters.push({
            id: itemId,
            title: title.trim(),
            href: manifestItem.href,
            content
          });
        }
      }
    });

    return chapters;

  } catch (error) {
    console.error('Error parsing EPUB structure:', error);
    throw error;
  }
};
