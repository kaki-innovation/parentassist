/**
 * ParentAssist design system — single source of truth for colours, typography,
 * spacing, and border radii. Used by both the mobile app and the web site.
 *
 * Palette: saffron + cream, inspired by Indian textiles.
 */

export const colors = {
  // Primary — saffron
  saffron: {
    50: '#FFF8ED',
    100: '#FFF0D3',
    200: '#FFDDA6',
    300: '#FFC46E',
    400: '#FFA033',
    500: '#FF8200', // Brand primary
    600: '#E06500',
    700: '#B84C00',
    800: '#923C04',
    900: '#783308',
  },

  // Secondary — cream / warm white
  cream: {
    50: '#FFFDF7',
    100: '#FFF9EC',
    200: '#FFF3D3',
    300: '#FFE9B2',
    400: '#FFD97A',
    500: '#FFC940',
  },

  // Accent — deep teal (for icons + accents)
  teal: {
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
  },

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutral
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const typography = {
  fonts: {
    heading: 'PlayfairDisplay-Bold',       // Playfair Display — headings
    headingRegular: 'PlayfairDisplay-Regular',
    body: 'DMSans-Regular',               // DM Sans — body
    bodyMedium: 'DMSans-Medium',
    bodySemiBold: 'DMSans-SemiBold',
    bodyBold: 'DMSans-Bold',
  },
  // Web/CSS equivalents (used by apps/web)
  fontFamilies: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 44,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
} as const;

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
