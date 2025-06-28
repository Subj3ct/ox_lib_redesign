import { IDateInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { DatePicker, DateRangePicker } from '@mantine/dates';
import { createStyles, useMantineTheme } from '@mantine/core';
import { useEffect } from 'react';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: IDateInput;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  // Custom date input styling to match glassmorphism theme
  dateInput: {
    '& .mantine-DatePicker-input, & .mantine-DateRangePicker-input': {
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
    },
    '& .mantine-DatePicker-label, & .mantine-DateRangePicker-label': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      marginBottom: '6px',
    },
    '& .mantine-DatePicker-description, & .mantine-DateRangePicker-description': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: 'Roboto',
      fontSize: '12px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    '& .mantine-DatePicker-required, & .mantine-DateRangePicker-required': {
      color: theme.colors.red[4],
    },
    '& .mantine-DatePicker-rightSection, & .mantine-DateRangePicker-rightSection': {
      color: 'rgba(255, 255, 255, 0.7)',
      '& button': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
        },
      },
    },
  },
}));

const DateField: React.FC<Props> = (props) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  
  // Dynamically inject weekend color CSS based on theme
  useEffect(() => {
    const themeColor = theme.colors[theme.primaryColor][theme.fn.primaryShade()];
    
    // Create or update CSS custom property for weekend colors
    const style = document.createElement('style');
    style.id = 'ox-lib-weekend-colors';
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('ox-lib-weekend-colors');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.textContent = `
      /* Dynamic weekend color override using theme color */
      :root {
        --ox-lib-weekend-color: ${themeColor};
      }
      
      /* Apply to all possible weekend date selectors */
      .mantine-DatePicker-day[data-weekend="true"],
      .mantine-DateRangePicker-day[data-weekend="true"],
      .mantine-Calendar-day[data-weekend="true"],
      .mantine-Month-day[data-weekend="true"],
      .mantine-DatePicker-day.mantine-DatePicker-weekend,
      .mantine-DateRangePicker-day.mantine-DateRangePicker-weekend,
      .mantine-Calendar-day.mantine-Calendar-weekend,
      .mantine-Month-day.mantine-Month-weekend,
      [data-mantine-color-scheme] .mantine-DatePicker-day[data-weekend="true"],
      [data-mantine-color-scheme] .mantine-DateRangePicker-day[data-weekend="true"] {
        color: var(--ox-lib-weekend-color) !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Cleanup function to remove the style when component unmounts
    return () => {
      const styleToRemove = document.getElementById('ox-lib-weekend-colors');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [theme.colors, theme.primaryColor, theme.fn]);
  
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });

  return (
    <div className={classes.dateInput}>
      {props.row.type === 'date' && (
        <DatePicker
          value={controller.field.value ? new Date(controller.field.value) : controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          // Workaround to use timestamp instead of Date object in values
          onChange={(date) => controller.field.onChange(date ? date.getTime() : null)}
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
          withinPortal={true}
          dropdownType="modal"
          modalProps={{
            centered: true,
            styles: {
              modal: {
                backgroundColor: 'rgba(40, 40, 40, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                width: '320px !important',
                maxWidth: '90vw',
              },
              header: {
                backgroundColor: 'transparent',
                borderBottom: 'none',
                paddingBottom: 0,
              },
              body: {
                padding: '8px',
              },
            },
          }}
          styles={{
            calendarHeaderControl: {
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
            calendarHeaderLevel: {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        />
      )}
      {props.row.type === 'date-range' && (
        <DateRangePicker
          value={
            controller.field.value
              ? controller.field.value[0]
                ? controller.field.value.map((date: Date) => new Date(date))
                : controller.field.value
              : controller.field.value
          }
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(dates) =>
            controller.field.onChange(dates.map((date: Date | null) => (date ? date.getTime() : null)))
          }
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
          withinPortal={true}
          dropdownType="modal"
          modalProps={{
            centered: true,
            styles: {
              modal: {
                backgroundColor: 'rgba(40, 40, 40, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                width: '320px !important',
                maxWidth: '90vw',
              },
              header: {
                backgroundColor: 'transparent',
                borderBottom: 'none',
                paddingBottom: 0,
              },
              body: {
                padding: '8px',
              },
            },
          }}
          styles={{
            calendarHeaderControl: {
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
            calendarHeaderLevel: {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        />
      )}
    </div>
  );
};

export default DateField;
