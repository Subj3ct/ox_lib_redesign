import { Checkbox, createStyles } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const useStyles = createStyles((theme) => ({
  // Custom checkbox styling to match glassmorphism theme
  checkbox: {
    '& .mantine-Checkbox-input': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '4px',
      '&:checked': {
        backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
        border: `1px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
    },
    '& .mantine-Checkbox-label': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 400,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      marginLeft: '8px',
    },
  },
}));

const CheckboxField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.checkbox}>
      <Checkbox
        {...props.register}
        sx={{ display: 'flex' }}
        required={props.row.required}
        label={props.row.label}
        defaultChecked={props.row.checked}
        disabled={props.row.disabled}
      />
    </div>
  );
};

export default CheckboxField;
