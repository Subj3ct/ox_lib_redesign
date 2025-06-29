import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text, keyframes } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const breathe = keyframes({
  '0%, 100%': { 
    transform: 'scale(1)',
    opacity: 1,
  },
  '50%': { 
    transform: 'scale(1.005)',
    opacity: 0.95,
  },
});

const slideInScale = keyframes({
  '0%': {
    transform: 'translateY(-30px) scale(0.8)',
    opacity: 0,
  },
  '60%': {
    transform: 'translateY(8px) scale(1.05)',
    opacity: 0.9,
  },
  '100%': {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
  },
});

const slideOutScale = keyframes({
  '0%': {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
  },
  '100%': {
    transform: 'translateY(-30px) scale(0.85)',
    opacity: 0,
  },
});

const horizontalPulse = keyframes({
  '0%': {
    transform: 'translateX(0)',
  },
  '50%': {
    transform: 'translateX(160px)', 
  },
  '100%': {
    transform: 'translateX(0)',
  },
});

const scrollGlow = keyframes({
  '0%, 100%': {
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
  },
  '50%': {
    boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)',
  },
});

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 340,
    height: 'fit-content', 
    maxHeight: '70vh', 
    fontFamily: 'Roboto',
    background: `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.15) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.20) 0%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.22) 100%
      )
    `,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.5),
      0 6px 20px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2)
    `,
    borderRadius: '12px',
    overflow: 'hidden',
    animation: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 40%)
      `,
      borderRadius: 'inherit',
      zIndex: -1,
      pointerEvents: 'none',
    },
  },
  containerEntering: {
    animation: `${slideInScale} 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards`,
  },
  containerExiting: {
    animation: `${slideOutScale} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, 
    gap: 8,
    padding: '16px 16px 8px 16px', 
    position: 'relative',
    background: 'transparent',
    overflow: 'hidden',
  },
  titleContainer: {
    borderRadius: '8px',
    flex: '1 85%',
    background: `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.15) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.20) 0%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.22) 100%
      )
    `,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 40%)
      `,
      borderRadius: 'inherit',
      zIndex: -1,
      pointerEvents: 'none',
    },
  },
  titleText: {
    color: '#ffffff',
    padding: '10px 12px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    textTransform: 'uppercase',
    position: 'relative',
    zIndex: 10,
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    '& p': {
      margin: 0,
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    },
    '& strong': {
      fontWeight: 700,
      color: '#ffffff',
    },
  },
  horizontalPulse: {
    position: 'absolute',
    bottom: '2px',
    left: '8px', 
    width: '60px', 
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, transparent)`,
    boxShadow: `0 0 15px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
    borderRadius: '1px',
    animation: `${horizontalPulse} 4.5s linear infinite`,
    zIndex: 10,
  },
  buttonsContainer: {
    height: 'fit-content', 
    maxHeight: '50vh', 
    padding: '0 16px 0 16px',
    position: 'relative',
    background: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
  },
  buttonsWrapper: {
    height: 'fit-content', 
    maxHeight: '50vh', 
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '4px', 
    background: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    borderRadius: '8px',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '3px',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.3)',
      },
    },
  },
  buttonsFlexWrapper: {
    gap: 6, 
    background: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '12px',
    background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.02), transparent 60%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes, cx } = useStyles();
  const [visible, setVisible] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [forceCloseHoverCards, setForceCloseHoverCards] = useState(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    // Force close all hover cards before closing menu
    setForceCloseHoverCards(prev => prev + 1);
    setIsExiting(true);
    setTimeout(() => {
    setVisible(false);
      setIsExiting(false);
    }, 400); 
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => {
    // Force close all hover cards before closing menu
    setForceCloseHoverCards(prev => prev + 1);
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      setIsExiting(false);
    }, 400);
  });

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setIsExiting(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setIsExiting(false); // CRITICAL: Reset exit state before showing new menu
    }
    
    setContextMenu(data);
    setVisible(true);
    setIsEntering(true);
    setTimeout(() => setIsEntering(false), 800);
  });

  return (
    <Box 
      className={cx(classes.container, {
        [classes.containerEntering]: isEntering,
        [classes.containerExiting]: isExiting,
      })}
      style={{ display: visible ? 'block' : 'none' }}
    >
      {/* Inner glow effect */}
      <div className={classes.innerGlow} />
      
        <Flex className={classes.header}>
          {contextMenu.menu && (
            <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
          )}
          <Box className={classes.titleContainer}>
            <Text className={classes.titleText}>
              <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
            </Text>
          {/* Horizontal moving pulse */}
          <div className={classes.horizontalPulse} />
          </Box>
          <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
        </Flex>
      
        <Box className={classes.buttonsContainer}>
        <Box className={classes.buttonsWrapper}>
          <Stack className={classes.buttonsFlexWrapper} pb={16}>
            {Object.entries(contextMenu.options).map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} forceCloseHoverCards={forceCloseHoverCards} />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ContextMenu;
