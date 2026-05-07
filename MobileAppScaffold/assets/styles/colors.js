const commonColors = {
  primary: '#0D9488', // Teal 600
  secondary: '#3B82F6', // Blue 500
  accent: '#8B5CF6', // Violet 500
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  black: '#020617',
  white: '#FFFFFF',
  transparent: 'transparent',
  primaryLight: '#CCFBF1',
  secondaryLight: '#DBEAFE',
  gradient: ['#0D9488', '#3B82F6'],
};

export const lightTheme = {
  ...commonColors,
  background: '#F1F5F9', // Slate 100
  surface: '#FFFFFF',
  text: '#0F172A', // Slate 900
  textMuted: '#64748B', // Slate 500
  border: '#E2E8F0', // Slate 200
  glass: 'rgba(255, 255, 255, 0.8)',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  header: '#FFFFFF',
  iconBg: '#F1F5F9',
};

export const darkTheme = {
  ...commonColors,
  background: '#0F172A', // Slate 900
  surface: '#1E293B', // Slate 800
  text: '#F8FAFC', // Slate 50
  textMuted: '#94A3B8', // Slate 400
  border: '#334155', // Slate 700
  glass: 'rgba(15, 23, 42, 0.8)',
  card: '#1E293B',
  tabBar: '#1E293B',
  header: '#1E293B',
  iconBg: '#334155',
};

export default lightTheme;
