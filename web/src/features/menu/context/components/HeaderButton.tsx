import { Button, createStyles, keyframes } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

// Subtle hover glow animation
const hoverGlow = keyframes({
  '0%, 100%': {
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
  },
  '50%': {
    boxShadow: '0 0 25px rgba(255, 255, 255, 0.2)',
  },
});

// Icon pulse animation
const iconPulse = keyframes({
  '0%, 100%': { 
    transform: 'scale(1)',
    opacity: 1,
  },
  '50%': { 
    transform: 'scale(1.1)',
    opacity: 0.8,
  },
});

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: '8px',
    flex: '1 15%',
    alignSelf: 'stretch',
    height: 'auto',
    minHeight: '42px',
    textAlign: 'center',
    justifyContent: 'center',
    padding: '8px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Roboto',
    background: params.canClose === false 
      ? `
        linear-gradient(160deg, 
          rgba(255, 255, 255, 0.03) 0%,
          rgba(255, 255, 255, 0.02) 50%,
          rgba(255, 255, 255, 0.025) 100%
        )
      `
      : `
        linear-gradient(160deg, 
          rgba(255, 255, 255, 0.12) 0%,
          rgba(255, 255, 255, 0.08) 50%,
          rgba(255, 255, 255, 0.10) 100%
        ),
        linear-gradient(20deg,
          rgba(255, 255, 255, 0.15) 0%,
          rgba(255, 255, 255, 0.18) 50%,
          rgba(255, 255, 255, 0.16) 100%
        )
      `,
    border: params.canClose === false 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(255, 255, 255, 0.18)',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    boxShadow: params.canClose === false 
      ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
      : `
        0 12px 40px rgba(0, 0, 0, 0.5),
        0 6px 20px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2)
      `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: params.canClose === false ? 'not-allowed' : 'pointer',
    
    '&:hover': {
      background: params.canClose === false 
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(255, 255, 255, 0.12)',
      transform: params.canClose === false ? 'none' : 'translateY(-1px) scale(1.02)',
      boxShadow: params.canClose === false 
        ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
        : `0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 15px rgba(${theme.colors[theme.primaryColor][theme.fn.primaryShade()]
          .replace('#', '')
          .match(/.{2}/g)
          ?.map(hex => parseInt(hex, 16))
          .join(', ') || '239, 68, 68'}, 0.15)`,
      border: params.canClose === false 
        ? '1px solid rgba(255, 255, 255, 0.05)' 
        : `1px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
      animation: params.canClose === false ? 'none' : `${hoverGlow} 2s ease-in-out infinite`,
    },
    
    '&:active': {
      transform: params.canClose === false ? 'none' : 'translateY(0px) scale(0.98)',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'transparent', 
      borderRadius: '8px 8px 0 0',
      pointerEvents: 'none',
      opacity: params.canClose === false ? 0.3 : 0.8,
      zIndex: -1,
    },
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    filter: params.canClose === false ? 'none' : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon 
        icon={icon} 
        fontSize={iconSize} 
        fixedWidth 
        style={{
          color: canClose === false ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
          textShadow: canClose === false ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.6)',
        }}
      />
    </Button>
  );
};

export default HeaderButton;
