import Notifications from './features/notifications/NotificationWrapper';
import CircleProgressbar from './features/progress/CircleProgressbar';
import Progressbar from './features/progress/Progressbar';
import TextUI from './features/textui/TextUI';
import InputDialog from './features/dialog/InputDialog';
import ContextMenu from './features/menu/context/ContextMenu';
import { useNuiEvent } from './hooks/useNuiEvent';
import { setClipboard } from './utils/setClipboard';
import { fetchNui } from './utils/fetchNui';
import AlertDialog from './features/dialog/AlertDialog';
import ListMenu from './features/menu/list';
import Dev from './features/dev';
import { isEnvBrowser } from './utils/misc';
import SkillCheck from './features/skillcheck';
import RadialMenu from './features/menu/radial';
import { theme } from './theme';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { useConfig } from './providers/ConfigProvider';
import { GameRender } from './components/GameRender';
import { useMemo } from 'react';

const App: React.FC = () => {
  const { config, isLoading } = useConfig();

  useNuiEvent('setClipboard', (data: string) => {
    setClipboard(data);
  });

  fetchNui('init');

  // Create a properly merged theme with safe theme wrapper
  const mergedTheme = useMemo(() => {
    const baseTheme: MantineThemeOverride = {
      ...theme,
      primaryColor: config.primaryColor,
      primaryShade: config.primaryShade,
      colorScheme: config.darkMode ? 'dark' : 'light',
    };
    
    return baseTheme;
  }, [config.primaryColor, config.primaryShade, config.darkMode]);

  // Don't render UI components until config is loaded to prevent theme flicker
  if (isLoading) {
    return (
      <MantineProvider withNormalizeCSS withGlobalStyles theme={mergedTheme}>
        <GameRender />
        {/* Only show dev tools in browser during loading */}
        {isEnvBrowser() && <Dev />}
      </MantineProvider>
    );
  }

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={mergedTheme}>
      <GameRender />
      
      <Progressbar />
      <CircleProgressbar />
      <Notifications />
      <TextUI />
      <InputDialog />
      <AlertDialog />
      <ContextMenu />
      <ListMenu />
      <RadialMenu />
      <SkillCheck />
      {isEnvBrowser() && <Dev />}
    </MantineProvider>
  );
};

export default App;
