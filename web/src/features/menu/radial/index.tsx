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

// Gentle pulse animation for hover effect
const hoverPulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    // Transparent background to prevent GameRender black square from showing through
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
    background: `
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
    border: `1px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
    // Enhanced shadows for depth without blur
    boxShadow: `
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
      background: `
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
      background: `
        linear-gradient(135deg, 
          rgba(255, 255, 255, 0.35) 0%,
          rgba(255, 255, 255, 0.25) 25%,
          rgba(255, 255, 255, 0.18) 50%,
          rgba(255, 255, 255, 0.12) 75%,
          rgba(255, 255, 255, 0.22) 100%
        ),
        linear-gradient(45deg,
          rgba(120, 120, 120, 0.5) 0%,
          rgba(100, 100, 100, 0.6) 50%,
          rgba(80, 80, 80, 0.7) 100%
        )
      `,
      boxShadow: `
        0 0 25px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, 
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
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
    transition: 'color var(--anim-fast) var(--anim-easing)',
  },
  menuIconHover: {
    color: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
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
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
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
      // FAKE glassmorphism - NO backdrop-filter to prevent black square
      background: `
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
      border: `3px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all var(--anim-normal) var(--anim-easing)',
      boxShadow: `0 0 20px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, 0 8px 25px rgba(0, 0, 0, 0.4)`,
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
      '&:hover': {
        background: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
        transform: 'translate(-50%, -50%) scale(1.1)',
        boxShadow: `0 0 30px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, 0 12px 45px rgba(0, 0, 0, 0.6)`,
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
    background: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
    transform: 'scale(1.3)',
    boxShadow: `0 0 8px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
  },
}));

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

  const { classes, cx } = useStyles();

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
