import { extendTheme } from '@chakra-ui/react';

// Tessera design tokens.
// A tessera is a single mosaic tile. The palette borrows from Byzantine mosaics: a deep lapis
// ground, marble for the working surface, and gold smalti reserved for work the AI planner made.
export const palette = {
  marble: '#F4F4F0',
  surface: '#FFFFFF',
  ink: '#171C2E',
  muted: '#5B6175',
  line: '#E3E4E8',
  lineStrong: '#C8CAD2',
  night: '#141B4D',
  nightSoft: '#1E2766',
  lapis: '#2B44C7',
  gold: '#D4A12A',
  goldWash: '#FBF2DC',
  goldInk: '#6B4C06',
  // Label colours. These hex values are stored on cards in the database, so they stay fixed.
  verdigris: '#2C8A6E',
  ochre: '#C99227',
  rose: '#C7405A',
  saffron: '#E3B341'
};

// One easing family for the whole product: quick to start, soft to land
export const motion = {
  ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
  easeCss: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  fast: 0.14,
  base: 0.22,
  slow: 0.42
};

const theme = extendTheme({
  fonts: {
    heading: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif",
    body: "'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif"
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
    gold: {
      50: '#FDF8EC',
      100: '#FBF2DC',
      200: '#F4DFA6',
      300: '#EBC96E',
      400: '#E0B444',
      500: '#D4A12A',
      600: '#B3841A',
      700: '#8C6610',
      800: '#6B4C06',
      900: '#4A3404'
    },
    marble: palette.marble,
    surface: palette.surface,
    ink: palette.ink,
    muted: palette.muted,
    line: palette.line,
    lineStrong: palette.lineStrong,
    night: palette.night,
    nightSoft: palette.nightSoft,
    lapis: palette.lapis,
    goldWash: palette.goldWash,
    goldInk: palette.goldInk,
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
    tile: '4px',
    control: '8px',
    panel: '12px',
    sheet: '18px'
  },
  shadows: {
    tile: '0 1px 0 rgba(23, 28, 46, 0.05), 0 1px 2px rgba(23, 28, 46, 0.04)',
    raised: '0 1px 2px rgba(23, 28, 46, 0.06), 0 8px 24px -12px rgba(23, 28, 46, 0.18)',
    lifted: '0 2px 4px rgba(23, 28, 46, 0.06), 0 24px 48px -16px rgba(23, 28, 46, 0.32)',
    outline: '0 0 0 3px rgba(43, 68, 199, 0.32)'
  },
  // Archivo is a variable font with a width axis: display type is set expanded, UI text at normal width
  textStyles: {
    displayXl: {
      fontFamily: 'heading',
      fontStretch: '125%',
      fontWeight: 760,
      fontSize: ['40px', '52px', '64px', '76px'],
      lineHeight: '0.98',
      letterSpacing: '-0.035em'
    },
    display: {
      fontFamily: 'heading',
      fontStretch: '125%',
      fontWeight: 720,
      fontSize: ['30px', '36px', '44px'],
      lineHeight: '1.04',
      letterSpacing: '-0.03em'
    },
    pageTitle: {
      fontFamily: 'heading',
      fontStretch: '118%',
      fontWeight: 700,
      fontSize: ['26px', '30px'],
      lineHeight: '1.1',
      letterSpacing: '-0.028em'
    },
    sectionTitle: {
      fontFamily: 'heading',
      fontStretch: '112%',
      fontWeight: 650,
      fontSize: '17px',
      lineHeight: '1.3',
      letterSpacing: '-0.012em'
    },
    lead: {
      fontSize: ['17px', '19px'],
      lineHeight: '1.55',
      letterSpacing: '-0.005em'
    }
  },
  styles: {
    global: {
      'html, body': {
        bg: 'marble',
        color: 'ink'
      },
      body: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        fontFeatureSettings: "'tnum' 0, 'ss01'",
        textRendering: 'optimizeLegibility'
      },
      '::selection': {
        bg: 'brand.100'
      }
    }
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 680,
        letterSpacing: '-0.02em',
        color: 'ink'
      }
    },
    Button: {
      baseStyle: {
        fontWeight: 560,
        borderRadius: 'control',
        letterSpacing: '-0.005em',
        transitionProperty: 'background-color, border-color, color, box-shadow, transform',
        transitionDuration: '140ms',
        _active: { transform: 'translateY(1px)' },
        _focus: { boxShadow: 'outline' }
      },
      variants: {
        // Secondary action: white tile on a hairline
        quiet: {
          bg: 'surface',
          color: 'ink',
          border: '1px solid',
          borderColor: 'lineStrong',
          _hover: { bg: 'marble', borderColor: '#AEB1BC', _disabled: { bg: 'surface' } }
        },
        // Reserved for the AI planner: gold always means "the planner made this"
        ai: {
          bg: 'gold.500',
          color: 'night',
          _hover: { bg: 'gold.400', _disabled: { bg: 'gold.500' } },
          _active: { bg: 'gold.600' }
        },
        // Buttons placed on the dark lapis board bar
        onNight: {
          bg: 'rgba(255, 255, 255, 0.08)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          _hover: { bg: 'rgba(255, 255, 255, 0.16)' },
          _active: { bg: 'rgba(255, 255, 255, 0.22)' }
        },
        dangerQuiet: {
          bg: 'transparent',
          color: 'danger',
          _hover: { bg: 'rgba(199, 64, 90, 0.08)' },
          _active: { bg: 'rgba(199, 64, 90, 0.14)' }
        }
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
            borderColor: 'lineStrong',
            borderRadius: 'control',
            _hover: { borderColor: '#9DA1AE' },
            _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #2B44C7' },
            _placeholder: { color: '#8A8FA0' }
          }
        }
      }
    },
    Textarea: {
      variants: {
        outline: {
          bg: 'surface',
          borderColor: 'lineStrong',
          borderRadius: 'control',
          _hover: { borderColor: '#9DA1AE' },
          _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #2B44C7' },
          _placeholder: { color: '#8A8FA0' }
        }
      }
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'surface',
            borderColor: 'lineStrong',
            borderRadius: 'control',
            _hover: { borderColor: '#9DA1AE' },
            _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #2B44C7' }
          }
        }
      }
    },
    FormLabel: {
      baseStyle: {
        fontSize: 'sm',
        fontWeight: 560,
        color: 'ink',
        mb: '6px'
      }
    },
    FormError: {
      baseStyle: {
        text: { color: 'danger', fontSize: '13px' }
      }
    },
    Modal: {
      baseStyle: {
        dialog: { borderRadius: 'panel', boxShadow: 'lifted' },
        header: {
          fontFamily: 'heading',
          fontStretch: '112%',
          fontWeight: 680,
          fontSize: '19px',
          letterSpacing: '-0.02em'
        },
        overlay: { bg: 'rgba(20, 27, 77, 0.42)' },
        closeButton: { borderRadius: 'control' }
      }
    },
    Drawer: {
      baseStyle: {
        header: {
          fontFamily: 'heading',
          fontStretch: '112%',
          fontWeight: 680,
          fontSize: '19px',
          letterSpacing: '-0.02em'
        },
        overlay: { bg: 'rgba(20, 27, 77, 0.42)' },
        closeButton: { borderRadius: 'control' }
      }
    },
    Menu: {
      baseStyle: {
        list: {
          borderColor: 'line',
          borderRadius: 'panel',
          boxShadow: 'lifted',
          p: '6px',
          minW: '200px'
        },
        item: {
          fontSize: 'sm',
          borderRadius: 'control',
          py: '8px',
          px: '10px',
          _focus: { bg: 'marble' },
          _hover: { bg: 'marble' }
        },
        divider: { my: '6px', borderColor: 'line' }
      }
    },
    Tooltip: {
      baseStyle: {
        bg: 'night',
        color: 'white',
        borderRadius: 'control',
        fontSize: 'xs',
        px: '10px',
        py: '6px'
      }
    },
    Alert: {
      baseStyle: {
        container: { borderRadius: 'control' }
      }
    }
  }
});

export default theme;
