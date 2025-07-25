import { Box, createStyles, Stack, Tooltip, keyframes } from '@mantine/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import ListItem from './ListItem';
import Header from './Header';
import FocusTrap from 'focus-trap-react';
import { fetchNui } from '../../../utils/fetchNui';
import type { MenuPosition, MenuSettings } from '../../../typings';
import LibIcon from '../../../components/LibIcon';
import { useGlassStyle } from '../../../hooks/useGlassStyle';

const slideInScale = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateY(-20px) scale(0.9)',
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
  },
});

const breathe = keyframes({
  '0%, 100%': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  '50%': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  },
});

const useStyles = createStyles((theme, params: { position?: MenuPosition; itemCount: number; selected: number; glass: ReturnType<typeof useGlassStyle> }) => ({
  tooltip: {
    // Fake glassmorphism - no backdrop-filter to prevent black background
    background: params.glass.isDarkMode ? `
      linear-gradient(135deg, 
        rgba(0, 0, 0, 0.25) 0%,
        rgba(0, 0, 0, 0.18) 25%,
        rgba(0, 0, 0, 0.12) 50%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.15) 100%
      ),
      linear-gradient(45deg,
        rgba(20, 20, 20, 0.4) 0%,
        rgba(10, 10, 10, 0.5) 50%,
        rgba(0, 0, 0, 0.6) 100%
      )
    ` : `
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
    border: `1px solid ${params.glass.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)'}`,
    borderRadius: 12,
    boxShadow: params.glass.isDarkMode ? 
      '0 12px 40px rgba(0, 0, 0, 0.7), 0 6px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)' :
      '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    maxWidth: 350,
    whiteSpace: 'normal',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 400,
  },
  container: {
    position: 'absolute',
    pointerEvents: 'none',
    marginTop: params.position === 'top-left' || params.position === 'top-right' ? 5 : 0,
    marginLeft: params.position === 'top-left' || params.position === 'bottom-left' ? 5 : 0,
    marginRight: params.position === 'top-right' || params.position === 'bottom-right' ? 5 : 0,
    marginBottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 5 : 0,
    right: params.position === 'top-right' || params.position === 'bottom-right' ? 1 : undefined,
    left: params.position === 'bottom-left' ? 1 : undefined,
    bottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 1 : undefined,
    fontFamily: 'Roboto',
    width: 384,
    // Fake glassmorphism - no backdrop-filter to prevent black background
    background: params.glass.isDarkMode ? `
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
    border: `1px solid ${params.glass.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)'}`,
    borderRadius: 12,
    boxShadow: params.glass.isDarkMode ? `
      0 12px 40px rgba(0, 0, 0, 0.7),
      0 6px 20px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.4)
    ` : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    animation: `${slideInScale} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), ${breathe} 4s ease-in-out infinite`,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: params.glass.isDarkMode ? `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)
      ` : `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 40%)
      `,
      borderRadius: 'inherit',
      zIndex: -1,
      pointerEvents: 'none',
    },
  },
  buttonsWrapper: {
    height: 'fit-content',
    maxHeight: 415,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: params.itemCount <= 6 || params.selected === params.itemCount - 1 ? 12 : 0,
    // Fake glassmorphism - lighter overlay without backdrop-filter
    background: `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.06) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.10) 0%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.11) 100%
      )
    `,
  },
  scrollArrow: {
    // Fake glassmorphism - no backdrop-filter to prevent black background
    background: params.glass.isDarkMode ? `
      linear-gradient(135deg, 
        rgba(0, 0, 0, 0.25) 0%,
        rgba(0, 0, 0, 0.18) 25%,
        rgba(0, 0, 0, 0.12) 50%,
        rgba(0, 0, 0, 0.08) 75%,
        rgba(0, 0, 0, 0.15) 100%
      ),
      linear-gradient(45deg,
        rgba(20, 20, 20, 0.4) 0%,
        rgba(10, 10, 10, 0.5) 50%,
        rgba(0, 0, 0, 0.6) 100%
      )
    ` : `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.10) 50%,
        rgba(255, 255, 255, 0.12) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0.20) 50%,
        rgba(255, 255, 255, 0.19) 100%
      )
    `,
    textAlign: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: 25,
    border: `1px solid ${params.glass.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
    borderTop: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: params.glass.isDarkMode ? 
      '0 12px 40px rgba(0, 0, 0, 0.7), 0 6px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)' :
      '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  scrollArrowIcon: {
    color: '#ffffff',
    fontSize: 20,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
  },
}));

const ListMenu: React.FC = () => {
  const [menu, setMenu] = useState<MenuSettings>({
    position: 'top-left',
    title: '',
    items: [],
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [indexStates, setIndexStates] = useState<Record<number, number>>({});
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);
  const firstRenderRef = useRef(false);
  const glass = useGlassStyle();
  const { classes } = useStyles({ position: menu.position, itemCount: menu.items.length, selected, glass });

  const closeMenu = (ignoreFetch?: boolean, keyPressed?: string, forceClose?: boolean) => {
    if (menu.canClose === false && !forceClose) return;
    setVisible(false);
    if (!ignoreFetch) fetchNui('closeMenu', keyPressed);
  };

  // Helper function to find next non-disabled item
  const findNextEnabledItem = (currentIndex: number, direction: 'up' | 'down'): number => {
    const increment = direction === 'down' ? 1 : -1;
    let nextIndex = currentIndex;
    let attempts = 0;
    const maxAttempts = menu.items.length; // Prevent infinite loop
    
    do {
      if (direction === 'down') {
        nextIndex = nextIndex >= menu.items.length - 1 ? 0 : nextIndex + 1;
      } else {
        nextIndex = nextIndex <= 0 ? menu.items.length - 1 : nextIndex - 1;
      }
      attempts++;
    } while (menu.items[nextIndex]?.disabled && attempts < maxAttempts);
    
    return nextIndex;
  };

  const moveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (firstRenderRef.current) firstRenderRef.current = false;
    switch (e.code) {
      case 'ArrowDown':
        setSelected((selected) => {
          return findNextEnabledItem(selected, 'down');
        });
        break;
      case 'ArrowUp':
        setSelected((selected) => {
          return findNextEnabledItem(selected, 'up');
        });
        break;
      case 'ArrowRight':
        // Don't allow side scrolling on disabled items
        if (menu.items[selected]?.disabled) break;
        if (Array.isArray(menu.items[selected].values))
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] + 1 <= menu.items[selected].values?.length! - 1 ? indexStates[selected] + 1 : 0,
          });
        break;
      case 'ArrowLeft':
        // Don't allow side scrolling on disabled items
        if (menu.items[selected]?.disabled) break;
        if (Array.isArray(menu.items[selected].values))
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] - 1 >= 0 ? indexStates[selected] - 1 : menu.items[selected].values?.length! - 1,
          });

        break;
      case 'Enter':
        if (!menu.items[selected]) return;
        // Don't allow interaction with disabled items
        if (menu.items[selected]?.disabled) return;
        
        if (menu.items[selected].checked !== undefined && !menu.items[selected].values) {
          return setCheckedStates({
            ...checkedStates,
            [selected]: !checkedStates[selected],
          });
        }
        fetchNui('confirmSelected', [selected, indexStates[selected]]).catch();
        if (menu.items[selected].close === undefined || menu.items[selected].close) setVisible(false);
        break;
    }
  };

  useEffect(() => {
    if (menu.items[selected]?.checked === undefined || firstRenderRef.current) return;
    const timer = setTimeout(() => {
      fetchNui('changeChecked', [selected, checkedStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [checkedStates]);

  useEffect(() => {
    if (!menu.items[selected]?.values || firstRenderRef.current) return;
    const timer = setTimeout(() => {
      fetchNui('changeIndex', [selected, indexStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [indexStates]);

  useEffect(() => {
    if (!menu.items[selected]) return;
    listRefs.current[selected]?.scrollIntoView({
      block: 'nearest',
      inline: 'start',
    });
    listRefs.current[selected]?.focus({ preventScroll: true });
    // debounces the callback to avoid spam
    const timer = setTimeout(() => {
      fetchNui('changeSelected', [
        selected,
        menu.items[selected].values
          ? indexStates[selected]
          : menu.items[selected].checked
          ? checkedStates[selected]
          : null,
        menu.items[selected].values ? 'isScroll' : menu.items[selected].checked ? 'isCheck' : null,
      ]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [selected, menu]);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape', 'Backspace'].includes(e.code)) closeMenu(false, e.code);
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  const isValuesObject = useCallback(
    (values?: Array<string | { label: string; description: string }>) => {
      return Array.isArray(values) && typeof values[indexStates[selected]] === 'object';
    },
    [indexStates, selected]
  );

  useNuiEvent('closeMenu', () => closeMenu(true, undefined, true));

  useNuiEvent('setMenu', (data: MenuSettings) => {
    firstRenderRef.current = true;
    if (!data.startItemIndex || data.startItemIndex < 0) data.startItemIndex = 0;
    else if (data.startItemIndex >= data.items.length) data.startItemIndex = data.items.length - 1;
    
    // Find first enabled item if starting item is disabled
    let initialSelection = data.startItemIndex;
    if (data.items[initialSelection]?.disabled) {
      for (let i = 0; i < data.items.length; i++) {
        if (!data.items[i]?.disabled) {
          initialSelection = i;
          break;
        }
      }
    }
    
    setSelected(initialSelection);
    if (!data.position) data.position = 'top-left';
    listRefs.current = [];
    setMenu(data);
    setVisible(true);
    const arrayIndexes: { [key: number]: number } = {};
    const checkedIndexes: { [key: number]: boolean } = {};
    for (let i = 0; i < data.items.length; i++) {
      if (Array.isArray(data.items[i].values)) arrayIndexes[i] = (data.items[i].defaultIndex || 1) - 1;
      else if (data.items[i].checked !== undefined) checkedIndexes[i] = data.items[i].checked || false;
    }
    setIndexStates(arrayIndexes);
    setCheckedStates(checkedIndexes);
    listRefs.current[initialSelection]?.focus();
  });

  return (
    <>
      {visible && (
        <Tooltip
          label={
            isValuesObject(menu.items[selected].values)
              ? // @ts-ignore
                menu.items[selected].values[indexStates[selected]].description
              : menu.items[selected].description
          }
          opened={
            isValuesObject(menu.items[selected].values)
              ? // @ts-ignore
                !!menu.items[selected].values[indexStates[selected]].description
              : !!menu.items[selected].description
          }
          transitionDuration={0}
          classNames={{ tooltip: classes.tooltip }}
        >
          <Box className={classes.container}>
            <Header title={menu.title} />
            <Box className={classes.buttonsWrapper} onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => moveMenu(e)} sx={{ overflowY: 'scroll' }}>
              <FocusTrap active={visible}>
                <Stack spacing={8} p="8px">
                  {menu.items.map((item, index) => (
                    <React.Fragment key={`menu-item-${index}`}>
                      {item.label && (
                        <ListItem
                          index={index}
                          item={item}
                          scrollIndex={indexStates[index]}
                          checked={checkedStates[index]}
                          selected={selected === index}
                          ref={listRefs}
                        />
                      )}
                    </React.Fragment>
                  ))}
                  <Box sx={{ height: '8px' }} />
                </Stack>
              </FocusTrap>
            </Box>
            {menu.items.length > 6 && selected !== menu.items.length - 1 && (
              <Box className={classes.scrollArrow}>
                <LibIcon icon="chevron-down" className={classes.scrollArrowIcon} />
              </Box>
            )}
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default ListMenu;
