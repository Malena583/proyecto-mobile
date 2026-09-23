// theme.js
export const colors = {
  primary: '#1a1a2e',        // grafito oscuro (texto, headers)
  primaryLight: '#2d2d4a',
  secondary: '#ff6fb5',      // rosa vibrante (CTAs, badges, tab activo)
  secondaryDark: '#e0489a',  // rosa oscuro (hover/pressed)
  secondaryLight: '#ffd6ea', // rosa pastel (fondos suaves, chips)
  background: '#fafafa',
  surface: '#ffffff',
  textPrimary: '#1a1a2e',
  textSecondary: '#6b6b80',
  white: '#ffffff',
};

export const typography = {
  fontFamily: undefined, // RN usa la fuente del sistema por defecto; se puede cargar una custom con expo-font
  h1: { fontSize: 32, fontWeight: '800' },
  h2: { fontSize: 26, fontWeight: '800' },
  h3: { fontSize: 22, fontWeight: '700' },
  h4: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  button: { fontSize: 15, fontWeight: '600' },
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};