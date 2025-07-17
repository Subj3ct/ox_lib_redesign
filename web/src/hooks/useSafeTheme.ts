import { useMantineTheme } from '@mantine/core';

/**
 * Custom hook that provides theme access
 */
export const useSafeTheme = () => {
  return useMantineTheme();
};

// Export as default for easy replacement
export default useSafeTheme; 