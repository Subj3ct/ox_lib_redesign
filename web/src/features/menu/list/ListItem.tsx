import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
  selected: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string; selected: boolean; colorScheme?: string; disabled?: boolean }) => {
  const itemColor = params.colorScheme 
    ? theme.colors[params.colorScheme]?.[theme.fn.primaryShade()] || theme.colors[params.colorScheme]?.[8] || params.colorScheme
    : theme.colors[theme.primaryColor][theme.fn.primaryShade()];
  
  const getRgbFromHex = (hex: string) => {
    const result = hex.replace('#', '').match(/.{2}/g);
    return result ? result.map(h => parseInt(h, 16)).join(', ') : '239, 68, 68';
  };
  
  const itemColorRgb = itemColor.startsWith('#') ? getRgbFromHex(itemColor) : '239, 68, 68';

  return {
    buttonContainer: {
      background: params.disabled 
        ? 'rgba(255, 255, 255, 0.02)' 
        : params.selected 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      border: params.disabled
        ? '1px solid rgba(255, 255, 255, 0.05)'
        : params.selected 
          ? `1px solid ${itemColor}`
          : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      padding: 2,
      minHeight: 60,
      height: 'auto',
      scrollMargin: 8,
      boxShadow: params.disabled
        ? '0 2px 8px rgba(0, 0, 0, 0.1)'
        : params.selected
          ? `0 6px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(${itemColorRgb}, 0.3)`
          : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s ease',
      outline: 'none',
      position: 'relative',
      overflow: 'hidden',
      cursor: params.disabled ? 'not-allowed' : 'default',
      '&:focus': {
        outline: 'none',
      },
    },
    iconImage: {
      maxWidth: 32,
      filter: params.disabled 
        ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) grayscale(100%) opacity(0.4)' 
        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    },
    buttonWrapper: {
      paddingLeft: 5,
      paddingRight: 12,
      minHeight: '56px',
      alignItems: 'flex-start',
      paddingTop: 8,
      paddingBottom: 8,
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      marginTop: 4,
    },
    icon: {
      fontSize: 24,
      color: params.disabled 
        ? 'rgba(255, 255, 255, 0.4)' 
        : params.iconColor || '#ffffff',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
      filter: params.disabled 
        ? 'none' 
        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    },
    label: {
      color: params.disabled ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
      textTransform: 'uppercase',
      fontSize: 12,
      verticalAlign: 'middle',
      fontFamily: 'Roboto',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      letterSpacing: '0.5px',
    },
    mainText: {
      color: params.disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
      fontSize: 15,
      fontFamily: 'Roboto',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      lineHeight: 1.3,
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
    descriptionText: {
      color: params.disabled ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.7)',
      fontSize: 13,
      fontFamily: 'Roboto',
      fontWeight: 400,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      lineHeight: 1.4,
      marginTop: 2,
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
    chevronIcon: {
      fontSize: 14,
      color: params.disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    },
    scrollIndexValue: {
      color: params.disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
      textTransform: 'uppercase',
      fontSize: 14,
      fontFamily: 'Roboto',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    },
    progressStack: {
      width: '100%',
      marginRight: 5,
    },
    progressLabel: {
      color: params.disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
      fontSize: 15,
      fontFamily: 'Roboto',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
      verticalAlign: 'middle',
      marginBottom: 3,
    },
    textStack: {
      width: '100%',
      gap: 0,
    },
  };
});

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked, selected }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor, selected, colorScheme: item.colorScheme, disabled: item.disabled });

  return (
    <Box
      tabIndex={item.disabled ? -1 : index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text className={classes.mainText}>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text className={classes.mainText}>{item.label}</Text>
            <CustomCheckbox checked={checked} colorScheme={item.colorScheme}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'red'}
              styles={(progressTheme) => {
                // Respect the colorScheme property or fall back to theme color
                const colorToUse = item.colorScheme || progressTheme.primaryColor;
                const colorValue = progressTheme.colors[colorToUse]?.[progressTheme.fn.primaryShade()] || progressTheme.colors.red[8];
                
                return {
                  root: { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    overflow: 'hidden',
                  },
                  bar: {
                    background: `linear-gradient(90deg, ${colorValue}, rgba(255, 255, 255, 0.9))`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }
                };
              }}
            />
          </Stack>
        ) : (
          <Stack className={classes.textStack} spacing={0}>
            <Text className={classes.mainText}>{item.label}</Text>
            {item.description && (
              <Text className={classes.descriptionText}>{item.description}</Text>
            )}
          </Stack>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
