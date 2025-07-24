import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group, keyframes } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
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
    transform: 'translateY(-20px) scale(0.8)',
    opacity: 0,
  },
  '60%': {
    transform: 'translateY(5px) scale(1.05)',
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
    transform: 'translateY(-20px) scale(0.85)',
    opacity: 0,
  },
});

const horizontalPulse = keyframes({
  '0%': {
    transform: 'translateX(0)', 
  },
  '50%': {
    transform: 'translateX(120px)', 
  },
  '100%': {
    transform: 'translateX(0)', 
  },
});

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => {
  const glass = useGlassStyle();
  const safeThemeColor = theme.colors?.[theme.primaryColor]?.[theme.fn?.primaryShade() ?? 8] ?? '#ef4444';
  
  return {
    wrapper: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      display: 'flex',
      alignItems: 
        params.position === 'top-center' ? 'flex-start' :
        params.position === 'bottom-center' ? 'flex-end' : 'center',
      justifyContent: 
        params.position === 'right-center' ? 'flex-end' :
        params.position === 'left-center' ? 'flex-start' : 'center',
      padding: '20px',
      pointerEvents: 'none',
    },
    container: {
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Roboto',
      background: glass.isDarkMode ? `
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
      border: glass.isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: glass.isDarkMode ? `
        0 12px 40px rgba(0, 0, 0, 0.8),
        0 6px 20px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.4)
      ` : `
        0 12px 40px rgba(0, 0, 0, 0.5),
        0 6px 20px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2)
      `,
      borderRadius: '12px',
      padding: '16px 20px',
      minWidth: '200px',
      maxWidth: '400px',
      animation: `${breathe} 3s ease-in-out infinite`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: glass.isDarkMode ? `
          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.04) 0%, transparent 30%)
        ` : `
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 40%)
        `,
        borderRadius: 'inherit',
        animation: `${breathe} 3s ease-in-out infinite`,
        zIndex: -1,
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
      alignItems: 'center',
      gap: '10px',
      position: 'relative',
      zIndex: 2,
    },
    iconContainer: {
      position: 'relative',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
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
      animation: `${breathe} 2.5s ease-in-out infinite`,
    },
    textContent: {
      flex: 1,
      minWidth: 0, 
      fontSize: '17px', 
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      lineHeight: 1.5,
      letterSpacing: '-0.005em',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      fontWeight: 500,
      textAlign: 'center', 
      paddingRight: '10px', 
      position: 'relative',
      zIndex: 10,
      '& p': {
        margin: '0 0 8px 0',
        '&:last-child': {
          marginBottom: 0,
        },
      },
      '& strong': {
        fontWeight: 600,
        color: '#ffffff',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
      },
      '& em': {
        fontStyle: 'italic',
        color: 'rgba(255, 255, 255, 0.95)',
      },
      '& code': {
        background: 'rgba(255, 255, 255, 0.15)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '16px', 
        fontFamily: 'Monaco, Consolas, monospace',
      },
    },
    textContentNoIcon: {
      width: '100%',
      textAlign: 'center',
      paddingRight: '0px', 
    },
    positionTop: {
      marginTop: '40px',
    },
    positionBottom: {
      marginBottom: '40px',
    },
    positionLeft: {
      marginLeft: '40px',
    },
    positionRight: {
      marginRight: '40px',
    },
    horizontalPulse: {
      position: 'absolute',
      bottom: '4px',
      left: '0px', 
      width: '100px',
      height: '3px',
      background: `linear-gradient(90deg, transparent, ${safeThemeColor}, ${safeThemeColor}, transparent)`,
      boxShadow: `0 0 20px ${safeThemeColor}`,
      borderRadius: '2px',
      animation: `${horizontalPulse} 4s linear infinite`,
      zIndex: 10,
    },
  };
});

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes, cx } = useStyles({ position: data.position });
  
  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  // Get position-specific styling
  const getPositionStyles = () => {
    const styles: React.CSSProperties = {};
    
    switch (data.position) {
      case 'top-center':
        styles.marginTop = '40px';
        break;
      case 'bottom-center':
        styles.marginBottom = '40px';
        break;
      case 'left-center':
        styles.marginLeft = '40px';
        break;
      case 'right-center':
        styles.marginRight = '40px';
        break;
    }
    
    return styles;
  };

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
                     <Box 
             style={{
               ...data.style,
               ...getPositionStyles(),
             }} 
             className={cx(classes.container)}
           >
             <div className={classes.contentWrapper}>
               {data.icon && (
                 <div className={classes.iconContainer}>
                   {/* Icon glow effect */}
                   <div 
                     className={classes.iconGlow}
                     style={{
                       background: data.iconColor || '#ffffff',
                     }}
                   />
                   <LibIcon
                     icon={data.icon}
                     fixedWidth
                     size="lg"
                     animation={data.iconAnimation}
                     style={{
                       color: data.iconColor || '#ffffff',
                       filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
                       fontSize: '20px',
                       alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'flex-start',
                     }}
                   />
                 </div>
               )}
               <div className={cx(classes.textContent, !data.icon && classes.textContentNoIcon)}>
                 <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                   {data.text}
                 </ReactMarkdown>
               </div>
             </div>
             
             {/* Horizontal moving pulse line at bottom */}
             <div className={classes.horizontalPulse} />
           </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
