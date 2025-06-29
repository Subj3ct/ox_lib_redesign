import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import Glass from '../../components/Glass';
import { useGlassStyle } from '../../hooks/useGlassStyle';

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
    transform: 'translateY(-20px) scale(0.95)',
    opacity: 0,
  },
  '60%': {
    transform: 'translateY(5px) scale(1.02)',
    opacity: 0.8,
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
    transform: 'translateY(-20px) scale(0.95)',
    opacity: 0,
  },
});

const useStyles = createStyles((theme, { glassStyle }: { glassStyle: any }) => ({
  container: {
    width: 350,
    height: 'fit-content',
    minHeight: 70,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Roboto',
    background: glassStyle.mainBackground,
    border: `1px solid ${glassStyle.border}`,
    borderRadius: '12px',
    boxShadow: glassStyle.shadow,
    animation: `${breathe} 3s ease-in-out infinite`,
    // Add subtle texture overlay
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: glassStyle.textureOverlay,
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
  },
  containerEntering: {
    animation: `${slideInScale} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, ${breathe} 3s ease-in-out infinite 0.6s`,
  },
  containerExiting: {
    animation: `${slideOutScale} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    position: 'relative',
    zIndex: 2,
  },
  iconContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  iconGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    opacity: 0.15,
    filter: 'blur(12px)',
    zIndex: -1,
    animation: `${breathe} 2s ease-in-out infinite`,
  },
  textContent: {
    flex: 1,
    minWidth: 0, 
  },
  title: {
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.3,
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: '-0.02em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    fontWeight: 500,
  },
  descriptionOnly: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: glassStyle.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)',
    cursor: 'pointer',
    opacity: 0,
    transition: 'all var(--anim-fast) var(--anim-easing)',
    zIndex: 3,
    '&:hover': {
      background: glassStyle.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.25)',
      transform: 'scale(1.1)',
    },
  },
  progressRing: {
    position: 'relative',
    '& .mantine-RingProgress-root': {
      filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))',
    },
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderRadius: '0 2px 2px 0',
    background: `
      linear-gradient(180deg, 
        var(--accent-color) 0%, 
        var(--accent-color-dim) 50%,
        var(--accent-color) 100%
      )
    `,
    boxShadow: `
      0 0 20px var(--accent-color), 
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3),
      2px 0 10px rgba(0, 0, 0, 0.3)
    `,
    animation: `${breathe} 2.5s ease-in-out infinite`,
    // Add extra glow effect
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `
        linear-gradient(180deg,
          rgba(255, 255, 255, 0.3) 0%,
          transparent 30%,
          transparent 70%,
          rgba(255, 255, 255, 0.2) 100%
        )
      `,
      borderRadius: 'inherit',
    },
  },
}));

const durationCircle = keyframes({
  '0%': { 
    strokeDasharray: `0, ${15.1 * 2 * Math.PI}`,
    opacity: 0.8
  },
  '10%': {
    opacity: 1
  },
  '90%': {
    opacity: 1
  },
  '100%': { 
    strokeDasharray: `${15.1 * 2 * Math.PI}, 0`,
    opacity: 0.6
  },
});

const NotificationComponent: React.FC<{ 
  notification: NotificationProps, 
  toastId: string, 
  visible: boolean, 
  position: string 
}> = ({ notification, toastId, visible, position }) => {
  const glassStyle = useGlassStyle();
  const { classes, cx } = useStyles({ glassStyle });
  const [toastKey, setToastKey] = useState(0);
  
  // No glassmorphism

  const duration = notification.duration || 4000;
  let iconColor: string;

  if (!notification.iconColor) {
    switch (notification.type) {
      case 'error':
        iconColor = '#ef4444';
        break;
      case 'success':
        iconColor = '#10b981';
        break;
      case 'warning':
        iconColor = '#f59e0b';
        break;
      default:
        iconColor = '#3b82f6';
        break;
    }
  } else {
    iconColor = tinycolor(notification.iconColor).toRgbString();
  }

  return (
    <Box
      className={cx(
        classes.container,
        visible ? classes.containerEntering : classes.containerExiting
      )}
      style={{
        //@ts-ignore
        '--accent-color': iconColor,
        //@ts-ignore
        '--accent-color-dim': tinycolor(iconColor).setAlpha(0.6).toRgbString(),
        ...notification.style,
      }}
      //@ts-ignore
      onMouseEnter={() => {
        const closeBtn = document.querySelector(`[data-toast-id="${toastId}"] .${classes.closeButton}`) as HTMLElement;
        if (closeBtn) closeBtn.style.opacity = '1';
      }}
      //@ts-ignore
      onMouseLeave={() => {
        const closeBtn = document.querySelector(`[data-toast-id="${toastId}"] .${classes.closeButton}`) as HTMLElement;
        if (closeBtn) closeBtn.style.opacity = '0';
      }}
      data-toast-id={toastId}
    >
      {/* Accent bar */}
      <Box className={classes.accentBar} />
      
      {/* Close button */}
      <Box 
        className={classes.closeButton}
        onClick={() => toast.dismiss(toastId)}
      >
        <LibIcon icon="xmark" fontSize={10} color="white" />
      </Box>

      <Box className={classes.contentWrapper}>
        {notification.icon && (
          <Box className={classes.iconContainer}>
            {/* Icon glow effect */}
            <Box 
              className={classes.iconGlow}
              style={{ backgroundColor: iconColor }}
            />
            
            {notification.showDuration ? (
              <RingProgress
                key={toastKey}
                size={42}
                thickness={3}
                className={classes.progressRing}
                sections={[{ value: 100, color: tinycolor(iconColor).lighten(20).toString() }]}
                style={{ alignSelf: !notification.alignIcon || notification.alignIcon === 'center' ? 'center' : 'start' }}
                styles={{
                  root: {
                    '> svg > circle:nth-of-type(2)': {
                      animation: `${durationCircle} linear forwards reverse`,
                      animationDuration: `${duration}ms`,
                      stroke: '#ffffff',
                      strokeWidth: 3,
                      filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                    },
                  },
                }}
                label={
                  <Center>
                    <ThemeIcon
                      color={iconColor}
                      radius="xl"
                      size={32}
                      variant="filled"
                      style={{
                        background: `linear-gradient(135deg, ${iconColor}, ${tinycolor(iconColor).darken(10).toString()})`,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: `0 4px 12px ${tinycolor(iconColor).setAlpha(0.4).toString()}`,
                      }}
                    >
                      <LibIcon icon={notification.icon} fontSize={14} color="white" animation={notification.iconAnimation} />
                    </ThemeIcon>
                  </Center>
                }
              />
            ) : (
              <ThemeIcon
                color={iconColor}
                radius="xl"
                size={42}
                variant="filled"
                style={{ 
                  alignSelf: !notification.alignIcon || notification.alignIcon === 'center' ? 'center' : 'start',
                  background: `linear-gradient(135deg, ${iconColor}, ${tinycolor(iconColor).darken(10).toString()})`,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: `0 4px 12px ${tinycolor(iconColor).setAlpha(0.4).toString()}`,
                }}
              >
                <LibIcon icon={notification.icon} fontSize={16} color="white" animation={notification.iconAnimation} />
              </ThemeIcon>
            )}
          </Box>
        )}
        
        <Box className={classes.textContent}>
          {notification.title && <Text className={classes.title}>{notification.title}</Text>}
          {notification.description && (
            <ReactMarkdown
              components={MarkdownComponents}
              className={notification.title ? classes.description : classes.descriptionOnly}
            >
              {notification.description}
            </ReactMarkdown>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Notifications: React.FC = () => {
  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 4000;
    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    // Backwards compat with old notifications
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    toast.custom(
      (t) => (
        <NotificationComponent 
          notification={data} 
          toastId={t.id} 
          visible={t.visible} 
          position={position}
        />
      ),
      {
        duration: duration,
        position: position as any,
        id: toastId,
      }
    );
  });

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
        },
      }}
      containerStyle={{
        top: 20,
        left: 20,
        bottom: 20,
        right: 20,
      }}
      gutter={16}
    />
  );
};

export default Notifications;
