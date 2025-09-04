import { Theme } from "@epubjs-react-native/core";

export const readerTheme: Theme = {
  'body': {
    background: '#fff',
  },
  'span': {
    color: '#000 !important',
  },
  'p': {
    color: '#000 !important',
  },
  'li': {
    color: '#000 !important',
  },
  'h1': {
    color: '#000 !important',
  },
  'a': {
    'color': '#000 !important',
    'pointer-events': 'auto',
    'cursor': 'pointer',
  },
  '::selection': {
    background: 'lightskyblue',
  },
  'img, svg, image': {
    'max-width': '85vw !important',
    'max-height': '85vh !important',
    'height': 'auto !important',
    'width': 'auto !important',
    'object-fit': 'contain !important',
    'display': 'block !important',
    'margin': '0 auto !important'
  },
  'figure': {
    'page-break-inside': 'avoid !important',
    'break-inside': 'avoid !important',
    'text-align': 'center !important'
  }
};
