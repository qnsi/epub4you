export interface EpubTocEntry {
  id: string;
  title: string;
  href: string;
  playOrder: number;
  children?: EpubTocEntry[];
}

export const parseTOC = (
  tocId: string | null,
  manifestItems: any,
  extractedFiles: Record<string, string>
): EpubTocEntry[] => {
  if (!tocId || !manifestItems[tocId]) {
    console.log('No TOC found, will use spine order');
    return [];
  }

  const ncxPath = manifestItems[tocId].href;
  const ncxContent = extractedFiles[ncxPath];

  if (!ncxContent) {
    console.log('NCX file not found');
    return [];
  }

  try {
    // Parse NCX using regex (since we can't use DOMParser)
    const navPoints = [];

    // Find all navPoint elements
    const navPointRegex = /<navPoint[^>]*>([\s\S]*?)<\/navPoint>/g;
    let navMatch;

    while ((navMatch = navPointRegex.exec(ncxContent)) !== null) {
      const navPointContent = navMatch[1];

      // Extract attributes from opening tag
      const openingTag = navMatch[0].match(/<navPoint[^>]*>/)[0];
      const idMatch = openingTag.match(/id\s*=\s*["']([^"']+)["']/);
      const playOrderMatch = openingTag.match(/playOrder\s*=\s*["']([^"']+)["']/);

      // Extract navLabel text
      const navLabelMatch = navPointContent.match(/<navLabel[^>]*>[\s\S]*?<text[^>]*>([^<]*)<\/text>/);

      // Extract content src
      const contentMatch = navPointContent.match(/<content[^>]*src\s*=\s*["']([^"']+)["']/);

      if (navLabelMatch && contentMatch) {
        const tocEntry: EpubTocEntry = {
          id: idMatch ? idMatch[1] : `toc-${navPoints.length}`,
          title: navLabelMatch[1].trim(),
          href: contentMatch[1],
          playOrder: playOrderMatch ? parseInt(playOrderMatch[1]) : navPoints.length + 1
        };

        navPoints.push(tocEntry);
      }
    }

    // Sort by playOrder
    navPoints.sort((a, b) => a.playOrder - b.playOrder);

    return navPoints;

  } catch (error) {
    console.error('Error parsing NCX TOC:', error);
    return [];
  }
};
