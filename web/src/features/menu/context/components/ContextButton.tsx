import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text, keyframes } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

// Enhanced continuous glow animation for hover effects
const hoverGlow = keyframes({
  '0%, 100%': {
    opacity: 0.2,
  },
  '50%': {
    opacity: 0.4,
  },
});

// Shimmer animation for progress bars
const progressShimmer = keyframes({
  '0%': {
    transform: 'translateX(-100px)',
  },
  '100%': {
    transform: 'translateX(400px)',
  },
});

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean; colorScheme?: string }) => {
  // Determine the color to use - colorScheme takes priority over theme color
  const buttonColor = params.colorScheme 
    ? theme.colors[params.colorScheme]?.[theme.fn.primaryShade()] || theme.colors[params.colorScheme]?.[8] || params.colorScheme
    : theme.colors[theme.primaryColor][theme.fn.primaryShade()];
  
  // Get RGB values for glow effects
  const getRgbFromHex = (hex: string) => {
    const result = hex.replace('#', '').match(/.{2}/g);
    return result ? result.map(h => parseInt(h, 16)).join(', ') : '239, 68, 68';
  };
  
  const buttonColorRgb = buttonColor.startsWith('#') ? getRgbFromHex(buttonColor) : '239, 68, 68';

  return {
  inner: {
    justifyContent: 'flex-start',
      fontFamily: 'Roboto',
  },
  label: {
      fontWeight: 400,
    width: '100%',
      fontFamily: 'Roboto',
  },
    
  button: {
    height: 'fit-content',
    width: '100%',
      padding: 12,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Roboto',
      background: params.disabled 
        ? 'rgba(255, 255, 255, 0.02)' 
        : params.readOnly 
          ? 'rgba(255, 255, 255, 0.03)'
          : 'rgba(255, 255, 255, 0.05)', 
      border: `1px solid ${params.disabled 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(255, 255, 255, 0.1)'}`, 
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: params.disabled 
        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
        : '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)', // Reduced shadow opacity
      borderRadius: '8px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: params.disabled ? 'not-allowed' : params.readOnly ? 'default' : 'pointer',
      animation: 'none !important',
      transform: 'none',
      
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent)',
        borderRadius: '8px 8px 0 0',
        pointerEvents: 'none',
        opacity: params.disabled ? 0.2 : 0.8,
        zIndex: 1,
      },
      
    '&:hover': {
        backgroundColor: params.disabled 
          ? 'rgba(255, 255, 255, 0.02)' 
          : params.readOnly 
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(255, 255, 255, 0.12)', 
        transform: params.disabled || params.readOnly ? 'none' : 'translateY(-1px)',
        boxShadow: params.disabled 
          ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
          : params.readOnly
            ? '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : `0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 20px rgba(${buttonColorRgb}, 0.2), inset 0 0 0 1px ${buttonColor}`, // Use item-specific color
        border: params.disabled 
          ? '1px solid rgba(255, 255, 255, 0.05)' 
          : params.readOnly
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.25)', 
        animation: params.disabled || params.readOnly ? 'none' : `${hoverGlow} 2s ease-in-out infinite`,
        
        '& .mantine-Text-root': {
          transform: 'none', // Remove scaling to prevent text cutoff
        },
    },
      
    '&:active': {
        transform: params.disabled || params.readOnly ? 'none' : 'translateY(0px) scale(0.98)',
    },
  },
  iconImage: {
    maxWidth: '25px',
      borderRadius: '4px',
      filter: params.disabled ? 'grayscale(100%) opacity(0.4)' : 'none',
  },
  description: {
      color: params.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.75)',
      fontSize: '13px',
      fontFamily: 'Roboto',
      lineHeight: 1.4,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.2s ease', 
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      wordBreak: 'break-word',
      hyphens: 'auto',
      width: '100%',
      flex: 1,
      minWidth: 0,
      '& p': {
        margin: 0,
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        lineHeight: 1.4,
      },
  },
  dropdown: {
      padding: 16,
      color: '#ffffff',
      fontSize: '14px',
      maxWidth: 280,
    width: 'fit-content',
      fontFamily: 'Roboto',
      background: 'rgba(255, 255, 255, 0.1)',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      '& p': {
        margin: '0 0 8px 0',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        '&:last-child': {
          marginBottom: 0,
        },
      },
  },
  buttonStack: {
      gap: 6,
      flex: 1,
      minWidth: 0, // Allow flex items to shrink below their minimum content size
      width: '100%',
  },
  buttonGroup: {
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      width: '100%',
  },
  buttonIconContainer: {
      width: 28,
      height: 28,
    justifyContent: 'center',
    alignItems: 'center',
      borderRadius: '6px',
      background: 'rgba(255, 255, 255, 0.06)', 
      border: '1px solid rgba(255, 255, 255, 0.1)', 
      position: 'relative',
      overflow: 'hidden',
      animation: 'none !important',
      transform: 'none',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
      wordWrap: 'break-word',
      wordBreak: 'break-word',
      hyphens: 'auto',
      width: '100%',
      flex: 1,
      minWidth: 0,
      fontSize: '15px',
      fontWeight: 500,
      color: params.disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      letterSpacing: '-0.01em',
      transition: 'all 0.2s ease', 
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      '& p': {
        margin: 0,
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        lineHeight: 1.4,
      },
      '& strong': {
        fontWeight: 600,
        color: params.disabled ? 'rgba(255, 255, 255, 0.5)' : '#ffffff',
      },
  },
  buttonArrowContainer: {
      width: 20,
      height: 20,
    justifyContent: 'center',
    alignItems: 'center',
      borderRadius: '4px',
      background: 'rgba(255, 255, 255, 0.06)', // Reduced opacity to match other elements
      border: '1px solid rgba(255, 255, 255, 0.1)', // Reduced border opacity
      opacity: params.disabled ? 0.4 : 1,
      transition: 'all 0.3s ease',
      // Remove any animations completely
      animation: 'none !important',
      transform: 'none',
    },
    progressBar: {
      '& .mantine-Progress-bar': {
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          animation: `${progressShimmer} 2s ease-in-out infinite`,
        },
      },
    },
    metadataText: {
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: 500,
      lineHeight: 1.4,
      margin: '0 0 8px 0',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      '&:last-child': {
        marginBottom: 0,
  },
    },
    metadataImage: {
      borderRadius: '6px',
      marginBottom: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
  };
});

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly, colorScheme: button.colorScheme });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
        closeDelay={100}
        transition="fade"
        transitionDuration={200}
        withinPortal
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}

          >
            <Group position="apart" w="100%">
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup} align="flex-start" noWrap={false}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer} style={{ flexShrink: 0 }}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="lg"
                            style={{ 
                              color: button.iconColor || (button.disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'),
                              filter: button.disabled ? 'none' : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                            }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText} style={{ flex: 1, minWidth: 0 }}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress 
                    value={button.progress} 
                    size="sm" 
                    color={button.colorScheme || 'red'}
                    className={classes.progressBar}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer} style={{ flexShrink: 0 }}>
                  <LibIcon 
                    icon="chevron-right" 
                    fixedWidth 
                    style={{ 
                      color: button.disabled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                      filter: button.disabled ? 'none' : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))'
                    }}
                  />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} className={classes.metadataImage} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <div key={`context-metadata-${index}`}>
                  <Text className={classes.metadataText}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'red'}
                      className={classes.progressBar}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        marginBottom: '8px',
                      }}
                    />
                  )}
                </div>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`} className={classes.metadataText}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
