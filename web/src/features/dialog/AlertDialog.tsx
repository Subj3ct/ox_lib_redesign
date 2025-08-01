import { Button, createStyles, Group, Modal, Stack, keyframes, Box, Text } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

import { useGlassStyle } from '../../hooks/useGlassStyle';
import { useSafeTheme } from '../../hooks/useSafeTheme';
import type { GlassStyle } from '../../hooks/useGlassStyle';
import { useConfig } from '../../providers/ConfigProvider';

const breathe = keyframes({
  '0%, 100%': { 
    transform: 'scale(1)',
  },
  '50%': { 
    transform: 'scale(1.005)',
  },
});

const horizontalPulse = keyframes({
  '0%': {
    transform: 'translateX(0)',
  },
  '50%': {
    transform: 'translateX(200px)', 
  },
  '100%': {
    transform: 'translateX(0)', 
  },
});

const slideInScale = keyframes({
  '0%': {
    transform: 'translateY(-10px) scale(0.95)',
    opacity: 0,
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
    transform: 'translateY(-10px) scale(0.95)',
    opacity: 0,
  },
});

const useStyles = createStyles((theme, { glass }: { glass: GlassStyle }) => ({
  overlay: {
    '& .mantine-Modal-overlay': {
      backgroundColor: glass.isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    },
  },
  container: {
    width: 'fit-content',
    height: 'fit-content',
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Roboto',
    background: glass.isDarkMode ? `
      linear-gradient(135deg, 
        rgba(45, 45, 45, 0.4) 0%,
        rgba(35, 35, 35, 0.3) 25%,
        rgba(40, 40, 40, 0.5) 50%,
        rgba(30, 30, 30, 0.6) 75%,
        rgba(38, 38, 38, 0.35) 100%
      ),
      linear-gradient(45deg,
        rgba(50, 50, 50, 0.3) 0%,
        rgba(42, 42, 42, 0.4) 50%,
        rgba(35, 35, 35, 0.5) 100%
      )
    ` : `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.07) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.10) 0%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.11) 100%
      )
    `,
    border: `1px solid ${glass.border}`,
    boxShadow: glass.shadow,
    borderRadius: '12px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: glass.isDarkMode ? `
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.025) 0%, transparent 30%)
      ` : glass.textureOverlay,
      borderRadius: 'inherit',
      animation: `${breathe} 3s ease-in-out infinite`,
      zIndex: -1,
    },
  },
      containerEntering: {
      animation: `${slideInScale} 0.1s ease-out forwards`,
    },
    containerExiting: {
      animation: `${slideOutScale} 0.08s ease-out forwards`,
    },
  header: {
    background: 'transparent',
    padding: '12px 24px 16px 24px',
    margin: '0',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    letterSpacing: '0.5px',
    margin: '0',
    width: '100%',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    position: 'relative',
    zIndex: 10,
  },
  horizontalPulse: {
    position: 'absolute',
    bottom: '4px', 
    left: '0px', 
    width: '120px',
    height: '3px',
    background: `linear-gradient(90deg, transparent, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, transparent)`,
    boxShadow: `0 0 20px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
    borderRadius: '2px',
    animation: `${horizontalPulse} 5s linear infinite`, 
    zIndex: 10,
  },
  contentContainer: {
    padding: '20px 24px 24px 24px',
    position: 'relative',
    zIndex: 2,
    transform: 'none',
  },
  contentText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto',
    lineHeight: 1.6,
    letterSpacing: '-0.005em',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    marginBottom: '24px',
    position: 'relative',
    zIndex: 10,
    transform: 'none',
    '& p': {
      margin: '0 0 12px 0',
      transform: 'none',
      '&:last-child': {
        marginBottom: 0,
      },
    },
    '& strong': {
      fontWeight: 600,
      color: '#ffffff',
    },
    '& em': {
      fontStyle: 'italic',
      color: 'rgba(255, 255, 255, 0.95)',
    },
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    position: 'relative',
    zIndex: 10,
    transform: 'none',
  },
  button: {
    fontFamily: 'Roboto',
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    minWidth: '100px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transform: 'none', 
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
  },
  cancelButton: {
    background: glass.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
    border: `1px solid ${glass.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)'}`,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: glass.isDarkMode ? 
      '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)' :
      '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    '&:hover': {
      background: glass.isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.15)',
      boxShadow: glass.isDarkMode ?
        '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)' :
        '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      transform: 'translateY(-1px)',
    },
  },
  confirmButton: {
    background: `linear-gradient(135deg, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, ${theme.colors[theme.primaryColor][6]})`,
    border: `1px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15), 0 0 12px ${theme.colors[theme.primaryColor][8]}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.colors[theme.primaryColor][5]}, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]})`,
      boxShadow: `0 4px 16px rgba(0, 0, 0, 0.2), 0 0 20px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
      transform: 'translateY(-1px) scale(1.02)',
    },
  },
  singleButton: {
    background: glass.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.12)',
    border: `1px solid ${glass.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)'}`,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: glass.isDarkMode ?
      '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)' :
      '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    '&:hover': {
      background: glass.isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.18)',
      boxShadow: glass.isDarkMode ?
        '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)' :
        '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      transform: 'translateY(-1px)',
    },
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const glass = useGlassStyle();
  const { classes, cx } = useStyles({ glass });
  const theme = useSafeTheme();
  const { config } = useConfig();
  const [opened, setOpened] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });



  const closeAlert = (button: string) => {
    setIsExiting(true);
    fetchNui('closeAlert', button);
    setTimeout(() => {
      setOpened(false);
      setIsExiting(false);
    }, config.disableAnimations ? 0 : 250); 
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setIsExiting(false);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setIsExiting(true);
    setTimeout(() => {
      setOpened(false);
      setIsExiting(false);
    }, config.disableAnimations ? 0 : 250); 
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          closeAlert('cancel');
        }}
        withCloseButton={false}
        classNames={{
          overlay: classes.overlay,
        }}
        styles={{
          modal: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
        transition={config.disableAnimations ? undefined : "fade"}
        transitionDuration={config.disableAnimations ? 0 : 800}
        title={null}
      >
        {/* Custom container with glassmorphism */}
        <Box 
          className={cx(
            classes.container,
            !config.disableAnimations && !isExiting ? classes.containerEntering : null,
            !config.disableAnimations && isExiting ? classes.containerExiting : null
          )}
        >
          {/* Header with title and moving horizontal pulse */}
          <div className={classes.header}>
            <div className={classes.title}>
              <ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>
            </div>
            {/* Horizontal moving pulse under title divider */}
            <div className={classes.horizontalPulse} />
          </div>

          <div className={classes.contentContainer}>
            <div className={classes.contentText}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ...MarkdownComponents,
                  img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
                }}
              >
                {dialogData.content}
              </ReactMarkdown>
            </div>

            <div className={classes.buttonsContainer}>
              {dialogData.cancel && (
                <button 
                  className={cx(classes.button, classes.cancelButton)}
                  onClick={() => closeAlert('cancel')}
                >
                  {dialogData.labels?.cancel || locale.ui.cancel}
                </button>
              )}
              <button
                className={cx(classes.button, dialogData.cancel ? classes.confirmButton : classes.singleButton)}
                onClick={() => closeAlert('confirm')}
              >
                {dialogData.labels?.confirm || locale.ui.confirm}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default AlertDialog;
