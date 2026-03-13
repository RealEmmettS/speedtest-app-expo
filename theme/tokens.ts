export const colors = {
  bgCanvas: '#f4f4f4',
  bgDevice: '#e9e9e9',
  bgScreen: '#dbdbdb',
  ink: '#111111',
  paper: '#ffffff',
  error: '#ff3b30',
  errorFaint: 'rgba(255, 59, 48, 0.05)',
} as const;

export const borders = {
  strokeWidth: 3,
  strokeThinWidth: 2,
  strokeColor: '#111111',
  radiusPill: 999,
  radiusBox: 16,
} as const;

export const typography = {
  fontFamily: 'Inter_500Medium',
  fontFamilySemiBold: 'Inter_600SemiBold',
  fontFamilyBold: 'Inter_700Bold',
  fontFamilyExtraBold: 'Inter_800ExtraBold',
  numberLarge: {
    fontSize: 56,
    fontFamily: 'Inter_500Medium',
    lineHeight: 56,
    letterSpacing: -2.2,
    fontVariant: ['tabular-nums'] as const,
  },
  numberMedium: {
    fontSize: 32,
    fontFamily: 'Inter_500Medium',
    lineHeight: 32,
    letterSpacing: -1.3,
    fontVariant: ['tabular-nums'] as const,
  },
  unit: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  metaLabel: {
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#111111',
  },
  metaValue: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
} as const;

export const spacing = {
  panelPadding: 24,
  dataRowPaddingVertical: 16,
  dataRowPaddingHorizontal: 24,
  topBarInset: 12,
  gap: 12,
} as const;
