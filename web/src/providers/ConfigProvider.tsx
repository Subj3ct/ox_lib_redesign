import { Context, createContext, useContext, useEffect, useState } from 'react';
import { MantineColor } from '@mantine/core';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';


interface Config {
  primaryColor: MantineColor;
  primaryShade: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  darkMode: boolean;
  disableAnimations?: boolean;
}

interface ConfigCtxValue {
  config: Config;
  setConfig: (config: Config) => void;
  isLoading: boolean;
}

const ConfigCtx = createContext<ConfigCtxValue | null>(null);

const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    primaryColor: 'red',
    primaryShade: 8,
    darkMode: true, // Default to dark mode since it's more common in gaming
    disableAnimations: false, // Default to animations enabled
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('[ox_lib] Config loading timeout, using defaults');
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    fetchNui<Config>('getConfig')
      .then((data) => {
        clearTimeout(timeoutId);
        setConfig(data);
        setIsLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.warn('[ox_lib] Failed to load config, using defaults:', error);
        // If fetching fails, use defaults and stop loading
        setIsLoading(false);
      });
  }, []);

  // Listen for config refresh from server when settings change
  useNuiEvent<Config>('refreshConfig', (data) => {
    setConfig(data);
  });

  return (
    <ConfigCtx.Provider value={{ config, setConfig, isLoading }}>
      {children}
    </ConfigCtx.Provider>
  );
};

export default ConfigProvider;

export const useConfig = () => useContext<ConfigCtxValue>(ConfigCtx as Context<ConfigCtxValue>);
