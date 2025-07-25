import { TimeInput } from '@mantine/dates';
import { Control, useController } from 'react-hook-form';
import { ITimeInput } from '../../../../typings/dialog';
import { FormValues } from '../../InputDialog';
import { createStyles } from '@mantine/core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ITimeInput;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  // Custom time input styling to match glassmorphism theme
  timeInput: {
    '& .mantine-TimeInput-input': {
      // Lighter glassmorphism background
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '8px',
      // Better font for user-typed text
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      fontSize: '14px',
      fontWeight: 400,
      color: '#ffffff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      cursor: 'pointer',
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
      '&:focus-within': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: `1px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
        boxShadow: `0 0 0 2px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}40, 0 2px 8px rgba(0, 0, 0, 0.15)`,
      },
    },
    '& .mantine-TimeInput-label': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      marginBottom: '6px',
    },
    '& .mantine-TimeInput-description': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: 'Roboto',
      fontSize: '12px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    '& .mantine-TimeInput-required': {
      color: theme.colors.red[4],
    },
    '& .mantine-TimeInput-rightSection': {
      color: 'rgba(255, 255, 255, 0.7)',
      '& button': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
        },
      },
    },
    // Style the time input segments
    '& .mantine-TimeInput-timeInput': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ffffff',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      '&:focus': {
        backgroundColor: `${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}20`,
        outline: 'none',
        borderRadius: '4px',
      },
      '&::selection': {
        backgroundColor: `${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}40`,
      },
    },
    // Style the separators
    '& .mantine-TimeInput-separator': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

const TimeField: React.FC<Props> = (props) => {
  const { classes } = useStyles();
  
  // Create default time (12:00 PM)
  const getDefaultTime = () => {
    if (props.row.default) return props.row.default;
    const defaultTime = new Date();
    defaultTime.setHours(12, 0, 0, 0);
    return defaultTime.getTime();
  };
  
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
    defaultValue: getDefaultTime(),
  });

  return (
    <div className={classes.timeInput}>
    <TimeInput
      value={controller.field.value ? new Date(controller.field.value) : controller.field.value}
      name={controller.field.name}
      ref={controller.field.ref}
      onBlur={controller.field.onBlur}
      onChange={(date) => controller.field.onChange(date ? date.getTime() : null)}
      label={props.row.label}
      description={props.row.description}
      disabled={props.row.disabled}
      format={props.row.format || '12'}
      withAsterisk={props.row.required}
      clearable={props.row.clearable}
      icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}

    />
    </div>
  );
};

export default TimeField;
