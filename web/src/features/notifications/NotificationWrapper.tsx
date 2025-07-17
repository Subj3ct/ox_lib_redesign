import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

const useStyles = createStyles((theme, { glassStyle, iconColor, iconColorDim }: { glassStyle: any, iconColor: string, iconColorDim: string }) => ({
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
      opacity: '1 !important',
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
        ${iconColor} 0%, 
        ${iconColorDim} 50%,
        ${iconColor} 100%
      )
    `,
    boxShadow: `
      0 0 20px ${iconColor}, 
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

// Calculate correct circumference for RingProgress size=42, thickness=3
// Radius = (size - thickness) / 2 = (42 - 3) / 2 = 19.5
const CIRCLE_RADIUS = 19.5;
const CIRCLE_CIRCUMFERENCE = CIRCLE_RADIUS * 2 * Math.PI;

const durationCircle = keyframes({
  '0%': { 
    strokeDasharray: `0, ${CIRCLE_CIRCUMFERENCE}`,
    opacity: 0.8,
    transform: 'rotate(-90deg)'
  },
  '10%': {
    opacity: 1
  },
  '90%': {
    opacity: 1
  },
  '100%': { 
    strokeDasharray: `${CIRCLE_CIRCUMFERENCE}, 0`,
    opacity: 0.6,
    transform: 'rotate(-90deg)'
  },
});

// Simpler fallback animation
const simpleDurationCircle = keyframes({
  '0%': { 
    strokeDashoffset: CIRCLE_CIRCUMFERENCE,
    opacity: 0.8
  },
  '100%': { 
    strokeDashoffset: 0,
    opacity: 0.6
  },
});


const safeColorOperation = (color: string, operation: 'lighten' | 'darken' | 'setAlpha', value: number, fallback: string) => {
  try {
    const colorObj = tinycolor(color);
    if (!colorObj.isValid()) return fallback;
    
    switch (operation) {
      case 'lighten':
        return colorObj.lighten(value).toString();
      case 'darken':
        return colorObj.darken(value).toString();
      case 'setAlpha':
        return colorObj.setAlpha(value).toString();
      default:
        return fallback;
    }
  } catch (error) {
    return fallback;
  }
};

const NotificationComponent: React.FC<{ 
  notification: NotificationProps, 
  toastId: string, 
  visible: boolean, 
  position: string 
}> = ({ notification, toastId, visible, position }) => {
  const glassStyle = useGlassStyle();
  const [isHovered, setIsHovered] = useState(false);
  
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
    // Validate the color before using it
    const colorObj = tinycolor(notification.iconColor);
    if (colorObj.isValid()) {
      iconColor = colorObj.toRgbString();
    } else {
      // Fallback to blue if invalid color
      iconColor = '#3b82f6';
    }
  }

  // Calculate iconColorDim for styles
  const iconColorDim = safeColorOperation(iconColor, 'setAlpha', 0.6, 'rgba(59, 130, 246, 0.6)');
  
  // Now that we have colors, create the styles
  const { classes, cx } = useStyles({ glassStyle, iconColor, iconColorDim });

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClose = useCallback(() => {
    toast.dismiss(toastId);
  }, [toastId]);

  
  const safeNotificationStyle = useMemo(() => {
    if (!notification.style || typeof notification.style !== 'object') {
      return {};
    }
    
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(notification.style)) {
      // Only include valid CSS values
      if (value !== null && value !== undefined && value !== '') {
        // Convert to string and check if it's a reasonable CSS value
        const stringValue = String(value);
        if (stringValue !== 'null' && stringValue !== 'undefined' && stringValue.length > 0) {
          sanitized[key] = stringValue;
        }
      }
    }
    return sanitized;
  }, [notification.style]);

  return (
    <Box
      className={cx(
        classes.container,
        visible ? classes.containerEntering : classes.containerExiting
      )}
      style={{
        ...safeNotificationStyle,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-toast-id={toastId}
    >
      {/* Accent bar */}
      <Box className={classes.accentBar} />
      
      {/* Close button */}
      <Box 
        className={classes.closeButton}
        onClick={handleClose}
        style={{ opacity: isHovered ? 1 : 0 }}
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
                key={toastId}
                size={42}
                thickness={3}
                className={classes.progressRing}
                sections={[{ value: 100, color: safeColorOperation(iconColor, 'lighten', 20, '#74c0fc') }]}
                style={{ alignSelf: !notification.alignIcon || notification.alignIcon === 'center' ? 'center' : 'start' }}
                styles={{
                  root: {
                                         // Target the progress circle more reliably
                     '& svg circle[stroke-linecap="round"]': {
                       strokeDasharray: `${CIRCLE_CIRCUMFERENCE}, ${CIRCLE_CIRCUMFERENCE}`,
                       animation: `${durationCircle} linear forwards reverse`,
                       animationDuration: `${duration}ms`,
                       stroke: '#ffffff !important',
                       strokeWidth: '3 !important',
                       filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                       transformOrigin: 'center',
                     },
                     // Fallback selector with simpler animation
                     '& svg circle:last-child': {
                       strokeDasharray: `${CIRCLE_CIRCUMFERENCE}, ${CIRCLE_CIRCUMFERENCE}`,
                       animation: `${simpleDurationCircle} linear forwards`,
                       animationDuration: `${duration}ms`,
                       stroke: '#ffffff !important',
                       strokeWidth: '3 !important',
                       filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                       transformOrigin: 'center',
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
                        background: `linear-gradient(135deg, ${iconColor}, ${safeColorOperation(iconColor, 'darken', 10, '#1971c2')})`,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: `0 4px 12px ${safeColorOperation(iconColor, 'setAlpha', 0.4, 'rgba(59, 130, 246, 0.4)')}`,
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
                  background: `linear-gradient(135deg, ${iconColor}, ${safeColorOperation(iconColor, 'darken', 10, '#1971c2')})`,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: `0 4px 12px ${safeColorOperation(iconColor, 'setAlpha', 0.4, 'rgba(59, 130, 246, 0.4)')}`,
                }}
              >
                <LibIcon icon={notification.icon} fontSize={16} color="white" animation={notification.iconAnimation} />
              </ThemeIcon>
            )}
          </Box>
        )}
        
        <Box className={classes.textContent}>
          {notification.title && (
            <Text 
              className={classes.title} 
              style={{ 
                marginBottom: notification.description ? 6 : 0,
                display: 'flex',
                alignItems: notification.description ? 'flex-start' : 'center',
                minHeight: notification.description ? 'auto' : '42px' // Match icon height
              }}
            >
              {notification.title}
            </Text>
          )}
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
  // Track recent notifications to prevent rapid duplicates
  const recentNotifications = useRef<Map<string, number>>(new Map());
  const idCounter = useRef<number>(0);

  const generateSafeId = useCallback((data: NotificationProps): string => {
    // If ID provided, use it with timestamp to prevent conflicts
    if (data.id) {
      return `${data.id}_${Date.now()}`;
    }
    
    // Generate unique ID based on content and counter
    idCounter.current += 1;
    const contentHash = `${data.title || ''}_${data.description || ''}_${data.type || ''}`;
    return `notification_${contentHash.length}_${idCounter.current}_${Date.now()}`;
  }, []);

  const isDuplicateRecent = useCallback((data: NotificationProps): boolean => {
    if (!data.title && !data.description) return true;
    
    const contentKey = `${data.title || ''}_${data.description || ''}_${data.type || ''}`;
    const now = Date.now();
    const lastTime = recentNotifications.current.get(contentKey);
    
    // Consider duplicate if same content within 200ms (reduced from 500ms)
    if (lastTime && (now - lastTime) < 200) {
      return true;
    }
    
    recentNotifications.current.set(contentKey, now);
    
    // Clean old entries (older than 5 seconds)
    for (const [key, time] of recentNotifications.current.entries()) {
      if (now - time > 5000) {
        recentNotifications.current.delete(key);
      }
    }
    
    return false;
  }, []);

  useNuiEvent<NotificationProps>('notify', (data) => {
    // Prevent empty notifications
    if (!data.title && !data.description) return;
    
    // Prevent rapid duplicates
    if (isDuplicateRecent(data)) return;

    const toastId = generateSafeId(data);
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
