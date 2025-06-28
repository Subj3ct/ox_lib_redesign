import { Checkbox, createStyles } from '@mantine/core';

interface CustomCheckboxProps {
  checked: boolean;
  colorScheme?: string;
}

const useStyles = createStyles((theme, params: { colorScheme?: string }) => {
  const checkboxColor = params.colorScheme 
    ? theme.colors[params.colorScheme]?.[theme.fn.primaryShade()] || theme.colors[params.colorScheme]?.[8] || params.colorScheme
    : theme.colors[theme.primaryColor][theme.fn.primaryShade()];
  
  const getRgbFromHex = (hex: string) => {
    const result = hex.replace('#', '').match(/.{2}/g);
    return result ? result.map(h => parseInt(h, 16)).join(', ') : '239, 68, 68';
  };
  
  const checkboxColorRgb = checkboxColor.startsWith('#') ? getRgbFromHex(checkboxColor) : '239, 68, 68';

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 8,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      '&:checked': { 
        background: `rgba(${checkboxColorRgb}, 0.3)`,
        borderColor: checkboxColor,
        boxShadow: `0 6px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 15px rgba(${checkboxColorRgb}, 0.4)`,
      },
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
      },
    },
    inner: {
      '> svg > path': {
        fill: '#ffffff',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))',
      },
    },
  };
});

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, colorScheme }) => {
  const { classes } = useStyles({ colorScheme });
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
