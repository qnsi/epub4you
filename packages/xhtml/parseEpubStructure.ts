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

    // Parse manifest items using regex
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

    // Parse spine and get TOC reference
    const spineIndex = opfContent.match(/<spine\s+([^>]*)>/);
    let tocId = null;

    if (spineIndex) {
      const spineAttrs = spineIndex[1];
      const tocMatch = spineAttrs.match(/toc\s*=\s*["']([^"']+)["']/);
      if (tocMatch) {
        tocId = tocMatch[1];
      }
    }

    const toc = parseTOC(tocId, manifestItems, extractedFiles);
    console.log("toc: ", toc)

    // Parse spine items using regex
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

    // Build chapters
    // {"href": "4663558823322991372_60793-h-0.htm.xhtml#pgepubid00000", "id": "np-1", "playOrder": 1, "title": "BIBLE PICTURES AND STORIES IN LARGE PRINT."}
    const chapters: EpubChapter[] = [];

    toc.forEach((tocEntry, index) => {
      const manifestItem = manifestItems[itemId];

      if (manifestItem && manifestItem.mediaType === 'application/xhtml+xml') {
        const content = extractedFiles[manifestItem.href];

        if (content) {
          // Extract title
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
