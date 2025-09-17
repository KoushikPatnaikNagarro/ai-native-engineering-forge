// Design tokens extracted from design-guidelines/design-tokens.tokens.json

export const designTokens = {
  // Color System
  colors: {
    // Brand Colors
    brand: {
      primary: '#0904a3', // primary green from tokens
      secondary: '#4d4dd9', // purple variants
    },
    
    // Text Colors
    text: {
      primary: '#06041f', // black from tokens
      secondary: 'rgba(6, 4, 31, 0.8)', // black with reduced opacity
      tertiary: 'rgba(6, 4, 31, 0.7)',
      disabled: 'rgba(6, 4, 31, 0.5)',
    },
    
    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#f8feff', // from card gradient bg
      accent: '#d1f5ea', // from card gradient bg
    },
    
    // Grey Scale
    grey: {
      main: '#bfbfbf',
      dark: 'rgba(191, 191, 191, 0.7)',
      light: 'rgba(191, 191, 191, 0.1)',
    },
    
    // Interactive States
    interactive: {
      default: '#0904a3',
      hover: '#0904a3',
      focus: '#0904a3',
      active: '#0904a3',
      disabled: 'rgba(9, 4, 163, 0.1)',
    },
    
    // Status Colors
    success: '#10b981', // green for confirmation
    warning: '#f59e0b', // amber for warnings
    error: '#dc2626',   // red for destructive actions
    info: '#3b82f6',    // blue for information
  },
  
  // Typography System
  typography: {
    fontFamily: {
      primary: ['Mulish', 'system-ui', 'sans-serif'],
    },
    
    // Font sizes and line heights from tokens
    scale: {
      // Headlines
      h3: {
        fontSize: '32px',
        lineHeight: '64.8px',
        fontWeight: 400,
      },
      
      // Paragraphs
      paragraph1: {
        fontSize: '18px',
        lineHeight: '29.16px',
        fontWeight: 400,
        letterSpacing: '0.18px',
      },
      
      // Subtitles
      subtitle1: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 500,
        letterSpacing: '0.5px',
      },
      
      // Button text
      button: {
        fontSize: '14px',
        lineHeight: '16px',
        fontWeight: 700,
        letterSpacing: '1px',
      },
      
      // Caption
      caption: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: 400,
        letterSpacing: '0.4px',
      },
    },
    
    // Font weights
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Spacing System (4px base unit)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
  },
  
  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  
  // Shadows from design tokens
  shadows: {
    base: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 1px 3px #cfcfcf',
    medium: '0px 2px 4px #cfcfcf, -4px 0px 4px #d9d9d9',
    large: '0px 10px 15px #cfcfcf, 0px 4px 6px #d9d9d9',
    hover: '0px 2px 15px #acacac, 0px -2px 15px #acacac',
  },
  
  // Responsive Breakpoints from grid system
  breakpoints: {
    xs: '0px',     // 0-599px (phone)
    sm: '600px',   // 600-904px (tablet)
    md: '905px',   // 905-1239px (web)
    lg: '1240px',  // 1240-1439px (laptop)
    xl: '1440px',  // 1440px+ (desktop)
  },
  
  // Animation timings
  animation: {
    fast: '150ms',
    standard: '250ms',
    slow: '400ms',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
} as const;

// Export individual token categories for easier access
export const colors = designTokens.colors;
export const typography = designTokens.typography;
export const spacing = designTokens.spacing;
export const shadows = designTokens.shadows;
export const borderRadius = designTokens.borderRadius;
export const breakpoints = designTokens.breakpoints;
export const animation = designTokens.animation;