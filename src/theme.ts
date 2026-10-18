import { extendTheme } from '@chakra-ui/react';

// Tessera design tokens. A tessera is a single mosaic tile: cards are tiles, boards are mosaics.
export const palette = {
  plaster: '#F2F3EF',
  surface: '#FFFFFF',
  ink: '#1E2925',
  muted: '#66706B',
  line: '#E3E5E0',
  lineStrong: '#C9CEC8',
  lapis: '#2B44C7',
  verdigris: '#2C8A6E',
  ochre: '#C99227',
  rose: '#C7405A',
  saffron: '#E3B341'
};

const theme = extendTheme({
  fonts: {
    heading: "'Bricolage Grotesque', 'Geist', system-ui, sans-serif",
    body: "'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif"
  },
  colors: {
    brand: {
      50: '#EEF1FC',
      100: '#D6DCF7',
      200: '#AEB9EF',
      300: '#8394E5',
      400: '#5A6FDA',
      500: '#2B44C7',
      600: '#2337A6',
      700: '#1C2C85',
      800: '#152166',
      900: '#0F1849'
    },
    plaster: palette.plaster,
    surface: palette.surface,
    ink: palette.ink,
    muted: palette.muted,
    line: palette.line,
    lineStrong: palette.lineStrong,
    lapis: palette.lapis,
    success: palette.verdigris,
    danger: palette.rose,
    // Card label colours, keyed by label type
    performance: palette.lapis,
    bug: palette.rose,
    feature: palette.verdigris,
    information: palette.ochre,
    warning: palette.saffron
  },
  radii: {
    tile: '6px',
    panel: '10px'
  },
  shadows: {
    tile: '0 1px 0 rgba(30, 41, 37, 0.06)',
    lifted: '0 12px 32px -12px rgba(30, 41, 37, 0.28)',
    outline: '0 0 0 3px rgba(43, 68, 199, 0.35)'
  },
  styles: {
    global: {
      'html, body': {
        bg: 'plaster',
        color: 'ink'
      },
      body: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      },
      '::selection': {
        bg: 'brand.100'
      }
    }
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: 'ink'
      }
    },
    Button: {
      baseStyle: {
        fontWeight: 500,
        borderRadius: 'tile'
      },
      defaultProps: {
        colorScheme: 'gray'
      }
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'surface',
            borderColor: 'line',
            borderRadius: 'tile',
            _hover: { borderColor: 'lineStrong' },
            _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #2B44C7' }
          }
        }
      }
    },
    FormLabel: {
      baseStyle: {
        fontSize: 'sm',
        fontWeight: 500,
        color: 'ink',
        mb: '6px'
      }
    },
    Modal: {
      baseStyle: {
        dialog: { borderRadius: 'panel' },
        header: { fontFamily: 'heading', fontWeight: 600, letterSpacing: '-0.01em' },
        overlay: { bg: 'rgba(30, 41, 37, 0.45)' }
      }
    },
    Drawer: {
      baseStyle: {
        header: { fontFamily: 'heading', fontWeight: 600, letterSpacing: '-0.01em' },
        overlay: { bg: 'rgba(30, 41, 37, 0.45)' }
      }
    },
    Menu: {
      baseStyle: {
        list: {
          borderColor: 'line',
          borderRadius: 'tile',
          boxShadow: 'lifted',
          py: '4px',
          minW: '180px'
        },
        item: {
          fontSize: 'sm',
          py: '8px',
          px: '12px'
        }
      }
    },
    Tooltip: {
      baseStyle: {
        bg: 'ink',
        borderRadius: '4px',
        fontSize: 'xs'
      }
    }
  }
});

export default theme;
