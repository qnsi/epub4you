import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { EpubChapter } from './parseEpubStructure';
import { replaceImagesInXHTML } from './replaceImagesInXHTML';
import { ImageAssets } from './extractImageAssets';

interface XHTMLViewerProps {
  chapter: EpubChapter;
  imageAssets: ImageAssets
  baseUrl?: string;
}

const XHTMLViewer: React.FC<XHTMLViewerProps> = ({ chapter, baseUrl, imageAssets }) => {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    processXHTMLContent();
  }, [chapter]);

  const processXHTMLContent = () => {
    let content = chapter.content;

    // Extract body content
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : content;

    const imageReplacedBodyContent = replaceImagesInXHTML(bodyContent, imageAssets)


    // Create complete HTML with styling
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Georgia, serif;
            font-size: 16px;
            line-height: 1.6;
            margin: 20px;
            color: #333;
            max-width: 100vw;
          }
          img {
            max-width: 80vw;
            height: auto;
            display: block;
            margin: 10px auto;
          }
          p {
            margin-bottom: 16px;
            text-align: justify;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: bold;
          }
          .center {
            text-align: center;
          }
          .figcenter {
            max-width: 80vw !important;
          }
        </style>
      </head>
      <body>
        ${imageReplacedBodyContent}
      </body>
      </html>
    `;

    setProcessedContent(htmlContent);
  };

  return (
    <WebView
      style={styles.webView}
      source={{ html: processedContent, baseUrl }}
      scalesPageToFit={false}
      showsVerticalScrollIndicator={true}
    />
  );
};

const styles = StyleSheet.create({
  webView: {
    width: "100%"
  },
});

export default XHTMLViewer;
