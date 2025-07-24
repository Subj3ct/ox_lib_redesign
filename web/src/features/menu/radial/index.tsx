import React, { useEffect, useState } from 'react';
import { Box, createStyles, Text, Group, Center, Stack, keyframes } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';
import { useGlassStyle } from '../../../hooks/useGlassStyle';

import { useSafeTheme } from '../../../hooks/useSafeTheme';

// Gentle pulse animation for hover effect
const hoverPulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
});

const useStyles = createStyles((theme, { safeThemeColor, glass }: { safeThemeColor: string; glass: ReturnType<typeof useGlassStyle> }) => {
  
  return {
    wrapper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      background: 'transparent',
    },
    radialContainer: {
      position: 'relative',
      width: 400,
      height: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItem: {
      position: 'absolute',
      width: 80,
      height: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      borderRadius: 12,
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
      border: `1px solid ${safeThemeColor}`,
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
        zIndex: -1,
        pointerEvents: 'none',
      },
      '&:hover': {
        transform: 'scale(1.15)',
        background: glass.isDarkMode ? `
          linear-gradient(135deg, 
            rgba(20, 20, 20, 0.75) 0%,
            rgba(30, 30, 30, 0.65) 25%,
            rgba(20, 20, 20, 0.85) 50%,
            rgba(10, 10, 10, 0.95) 75%,
            rgba(15, 15, 15, 0.80) 100%
          ),
          linear-gradient(45deg,
            rgba(40, 40, 40, 0.7) 0%,
            rgba(25, 25, 25, 0.8) 50%,
            rgba(10, 10, 10, 0.9) 100%
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
        boxShadow: glass.isDarkMode ? `
          0 0 25px ${safeThemeColor}, 
          0 12px 50px rgba(0, 0, 0, 0.8),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.5)
        ` : `
          0 0 25px ${safeThemeColor}, 
          0 12px 50px rgba(0, 0, 0, 0.6),
          inset 0 1px 0 rgba(255, 255, 255, 0.5),
          inset 0 -1px 0 rgba(0, 0, 0, 0.3)
        `,
      },
    },
    menuItemContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      width: '100%',
      height: '100%',
      transition: 'transform 0.3s ease',
      '&:hover': {
        animation: `${hoverPulse} 3s infinite`,
      },
    },
    menuIcon: {
      fontSize: 24,
      color: '#ffffff',
      filter: glass.isDarkMode ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
      transition: 'color var(--anim-fast) var(--anim-easing)',
    },
    menuIconHover: {
      color: safeThemeColor,
    },
    menuLabel: {
      fontSize: 11,
      fontWeight: 600,
      color: '#ffffff',
      textAlign: 'center',
      lineHeight: 1.2,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      textShadow: glass.isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.8)' : '0 1px 3px rgba(0, 0, 0, 0.6)',
      letterSpacing: '0.5px',
    },
    centerCloseButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 70,
      height: 70,
      borderRadius: '50%',
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
        linear-gradient(135deg, 
          rgba(255, 255, 255, 0.25) 0%,
          rgba(255, 255, 255, 0.18) 25%,
          rgba(255, 255, 255, 0.12) 50%,
          rgba(255, 255, 255, 0.08) 75%,
          rgba(255, 255, 255, 0.15) 100%
        ),
        linear-gradient(45deg,
          rgba(120, 120, 120, 0.4) 0%,
          rgba(100, 100, 100, 0.5) 50%,
          rgba(80, 80, 80, 0.6) 100%
        )
      `,
      border: `3px solid ${safeThemeColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all var(--anim-normal) var(--anim-easing)',
      boxShadow: glass.isDarkMode ? `
        0 0 20px ${safeThemeColor},
        0 12px 40px rgba(0, 0, 0, 0.8),
        0 6px 20px rgba(0, 0, 0, 0.6)
      ` : `
        0 0 20px ${safeThemeColor},
        0 8px 25px rgba(0, 0, 0, 0.4)
      `,
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
        zIndex: -1,
        pointerEvents: 'none',
      },
      '&:hover': {
        background: safeThemeColor,
        transform: 'translate(-50%, -50%) scale(1.1)',
        boxShadow: glass.isDarkMode ? `
          0 0 30px ${safeThemeColor},
          0 12px 45px rgba(0, 0, 0, 0.8)
        ` : `
          0 0 30px ${safeThemeColor},
          0 12px 45px rgba(0, 0, 0, 0.6)
        `,
      },
    },
    closeButtonContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      '&:hover': {
        animation: `${hoverPulse} 3s infinite`,
      },
    },
    closeIcon: {
      fontSize: 24,
      color: '#ffffff',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
      transition: 'color var(--anim-fast) var(--anim-easing)',
    },
    paginationIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, 60px)', // Position below center button
      display: 'flex',
      gap: 8,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.4)',
      transition: 'all var(--anim-fast) var(--anim-easing)',
    },
    paginationDotActive: {
      background: safeThemeColor,
      transform: 'scale(1.3)',
      boxShadow: `0 0 8px ${safeThemeColor}`,
    },
  };
});

const ITEMS_PER_PAGE = 8; // Max items to show at once in circle

const RadialMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [radialMenu, setRadialMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { locale } = useLocales();
  const theme = useSafeTheme();
  const safeThemeColor = theme.colors?.[theme.primaryColor]?.[theme.fn?.primaryShade() ?? 8] ?? '#ef4444';
  const glass = useGlassStyle();

  const { classes, cx } = useStyles({ safeThemeColor, glass });

  const changePage = async (increment?: boolean) => {
    await fetchNui('radialTransition');

    setTimeout(() => {
      setVisible(true);
      setRadialMenu({ ...radialMenu, page: increment ? radialMenu.page + 1 : radialMenu.page - 1 });
    }, 100);

    setVisible(true);
    setRadialMenu({ ...radialMenu, page: increment ? radialMenu.page + 1 : radialMenu.page - 1 });
  };

  // Smart back button handler
  const handleBackButton = () => {
    if (radialMenu.page > 1) {
      // If on page 2+, go back a page first
      changePage(false);
    } else if (radialMenu.sub) {
      // If on page 1 but in submenu, go back to parent menu
      fetchNui('radialBack');
    } else {
      // Close the menu properly
      handleClose();
    }
  };

  const totalPages = Math.ceil((radialMenu.items?.length || 0) / ITEMS_PER_PAGE);

  useEffect(() => {
    if (!radialMenu.items || radialMenu.items.length <= ITEMS_PER_PAGE) {
      setMenuItems(radialMenu.items || []);
      return;
    }
    
    const startIndex = (radialMenu.page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    let items = radialMenu.items.slice(startIndex, endIndex);
    
    // If there are more items, replace the last item with "more" button
    if (endIndex < radialMenu.items.length) {
      items = items.slice(0, ITEMS_PER_PAGE - 1);
      items.push({ icon: 'ellipsis-h', label: locale.ui.more, isMore: true });
    }
    
    setMenuItems(items);
  }, [radialMenu.items, radialMenu.page, locale.ui.more]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      const optionIndex = data.items.findIndex(item => item.menu === data.option);
      if (optionIndex !== -1) {
        initialPage = Math.floor(optionIndex / ITEMS_PER_PAGE) + 1;
      }
    }
    setRadialMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setRadialMenu({ ...radialMenu, items: data });
  });

  const handleItemClick = async (item: RadialMenuItem, index: number) => {
    if (item.isMore) {
      await changePage(true);
      return;
    }
    
    const clickIndex = radialMenu.page === 1 ? index : (radialMenu.page - 1) * ITEMS_PER_PAGE + index;
    fetchNui('radialClick', clickIndex);
  };

  const handleClose = () => {
    setVisible(false);
    fetchNui('radialClose'); // Proper close event that handles focus
  };

  // ESC key handler to close radial from any page/submenu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        event.preventDefault();
        handleClose(); // Close immediately, bypassing back navigation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleRightClick = async () => {
    if (radialMenu.page > 1) await changePage();
    else if (radialMenu.sub) fetchNui('radialBack');
  };

  // Calculate circular positions for items
  const getCircularPosition = (index: number, total: number, radius: number = 140) => {
    if (total === 1) {
      // Single item goes in center-top position
      return { x: 0, y: -radius * 0.7 };
    }
    
    // Start from top and go clockwise
    const angle = (2 * Math.PI * index / total) - (Math.PI / 2);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    return { x, y };
  };

  return (
    <Box 
      className={classes.wrapper}
      onContextMenu={handleRightClick}
    >
      <ScaleFade visible={visible}>
        <Box className={classes.radialContainer}>
          {menuItems.map((item, index) => {
            const position = getCircularPosition(index, menuItems.length);
            
            return (
              <Box
                key={`radial-item-${index}`}
                className={classes.menuItem}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                onClick={() => handleItemClick(item, index)}
              >
                <Box 
                  className={classes.menuItemContent}
                >
                  <Box className={classes.menuIcon}>
                    {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                      <img
                        src={item.icon}
                        width={Math.min(Math.max(item.iconWidth || 24, 16), 32)}
                        height={Math.min(Math.max(item.iconHeight || 24, 16), 32)}
                        alt={item.label}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))' }}
                      />
                    ) : (
                      <LibIcon
                        icon={item.icon as IconProp}
                        fontSize={24}
                        fixedWidth
                      />
                    )}
                  </Box>
                  <Text className={classes.menuLabel}>
                    {item.label}
                  </Text>
                </Box>
              </Box>
            );
          })}
          
          {/* Smart center button - handles pagination and menu navigation */}
          <Box
            className={classes.centerCloseButton}
            onClick={handleBackButton}
          >
            <Box 
              className={classes.closeButtonContent}
            >
              <LibIcon 
                icon={
                  radialMenu.page > 1 ? "arrow-left" :      // Page navigation
                  radialMenu.sub ? "arrow-left" :           // Menu navigation  
                  "xmark"                             // Close
                } 
                className={classes.closeIcon} 
              />
            </Box>
          </Box>
          
          {/* Pagination indicators - positioned below center button */}
          {totalPages > 1 && (
            <Box className={classes.paginationIndicator}>
              {Array.from({ length: totalPages }, (_, i) => (
                <Box
                  key={i}
                  className={cx(
                    classes.paginationDot,
                    i + 1 === radialMenu.page && classes.paginationDotActive
                  )}
                />
              ))}
            </Box>
          )}
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default RadialMenu;
