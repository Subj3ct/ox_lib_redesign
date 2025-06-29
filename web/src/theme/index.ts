import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { 
    sm: '1px 1px 3px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  components: {
    Button: {
      styles: {
        root: {
          border: 'none',
        },
      },
    },
  },
  other: {
    // Glassmorphism design tokens
    glass: {
      background: 'rgba(20, 20, 20, 0.8)',
      backgroundLight: 'rgba(30, 30, 30, 0.7)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(16px)',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    // Dark mode glassmorphism design tokens
    glassDark: {
      background: `
        linear-gradient(135deg, 
          rgba(0, 0, 0, 0.65) 0%,
          rgba(20, 20, 20, 0.55) 25%,
          rgba(10, 10, 10, 0.75) 50%,
          rgba(0, 0, 0, 0.85) 75%,
          rgba(5, 5, 5, 0.70) 100%
        ),
        linear-gradient(45deg,
          rgba(30, 30, 30, 0.6) 0%,
          rgba(15, 15, 15, 0.7) 50%,
          rgba(0, 0, 0, 0.8) 100%
        )
      `,
      backgroundLight: `
        linear-gradient(135deg, 
          rgba(0, 0, 0, 0.45) 0%,
          rgba(20, 20, 20, 0.35) 25%,
          rgba(10, 10, 10, 0.55) 50%,
          rgba(0, 0, 0, 0.65) 75%,
          rgba(5, 5, 5, 0.50) 100%
        ),
        linear-gradient(45deg,
          rgba(30, 30, 30, 0.4) 0%,
          rgba(15, 15, 15, 0.5) 50%,
          rgba(0, 0, 0, 0.6) 100%
        )
      `,
      border: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '12px',
      shadow: `
        0 12px 40px rgba(0, 0, 0, 0.8),
        0 6px 20px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.4)
      `,
      textureOverlay: `
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.04) 0%, transparent 30%)
      `,
    },
    animations: {
      // Smooth, professional animation durations
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design easing
    },
  },
};
