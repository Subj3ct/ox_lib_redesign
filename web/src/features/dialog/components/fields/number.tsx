import { NumberInput, createStyles } from '@mantine/core';
import { INumber } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: INumber;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  // Custom number input styling to match glassmorphism theme
  number: {
    '& .mantine-NumberInput-input': {
      // Lighter glassmorphism background
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '8px',
      // Better font for user-typed text
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      fontSize: '14px',
      fontWeight: 400,
      color: '#ffffff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.6)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      },
      '&:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: `1px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
        boxShadow: `0 0 0 2px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}40, 0 2px 8px rgba(0, 0, 0, 0.15)`,
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
    },
    '& .mantine-NumberInput-label': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      marginBottom: '6px',
    },
    '& .mantine-NumberInput-description': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: 'Roboto',
      fontSize: '12px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    '& .mantine-NumberInput-required': {
      color: theme.colors.red[4],
    },
    '& .mantine-NumberInput-rightSection': {
      color: 'rgba(255, 255, 255, 0.7)',
      '& button': {
        color: 'rgba(255, 255, 255, 0.7)',
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
        },
      },
    },
  },
}));

const NumberField: React.FC<Props> = (props) => {
  const { classes } = useStyles();
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });

  return (
    <div className={classes.number}>
      <NumberInput
        value={controller.field.value}
        name={controller.field.name}
        ref={controller.field.ref}
        onBlur={controller.field.onBlur}
        onChange={controller.field.onChange}
        label={props.row.label}
        description={props.row.description}
        defaultValue={props.row.default}
        min={props.row.min}
        max={props.row.max}
        step={props.row.step}
        precision={props.row.precision}
        disabled={props.row.disabled}
        icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
        withAsterisk={props.row.required}
      />
    </div>
  );
};

export default NumberField;
