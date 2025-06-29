import { Button, Group, Modal, Stack, createStyles, useMantineTheme, keyframes, Box } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';
import { useConditionalGlassmorphism } from '../../components/GameRender';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const breathe = keyframes({
  '0%, 100%': { 
    transform: 'scale(1)',
  },
  '50%': { 
    transform: 'scale(1.005)',
  },
});

const horizontalPulse = keyframes({
  '0%': {
    transform: 'translateX(0)', 
  },
  '50%': {
    transform: 'translateX(220px)', 
  },
  '100%': {
    transform: 'translateX(0)', 
  },
});

const slideInScale = keyframes({
  '0%': {
    transform: 'translateY(-40px) scale(0.8)',
    opacity: 0,
  },
  '50%': {
    transform: 'translateY(10px) scale(1.05)',
    opacity: 0.9,
  },
  '70%': {
    transform: 'translateY(-5px) scale(0.98)',
    opacity: 1,
  },
  '100%': {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
  },
});

const slideOutScale = keyframes({
  '0%': {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
  },
  '100%': {
    transform: 'translateY(-30px) scale(0.85)',
    opacity: 0,
  },
});

const useStyles = createStyles((theme) => ({
  // Modal backdrop - transparent to show game background
  overlay: {
    '& .mantine-Modal-overlay': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    },
  },
  container: {
    width: 'fit-content',
    height: 'fit-content',
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Roboto',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'inherit',
      borderRadius: 'inherit',
      animation: `${breathe} 3s ease-in-out infinite`,
      zIndex: -1,
    },
  },
  containerEntering: {
    animation: `${slideInScale} 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards`,
  },
  containerExiting: {
    animation: `${slideOutScale} 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards`,
  },
  header: {
    background: 'transparent',
    padding: '12px 24px 16px 24px',
    margin: '0',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    letterSpacing: '0.5px',
    margin: '0',
    width: '100%',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    position: 'relative',
    zIndex: 10,
  },
  horizontalPulse: {
    position: 'absolute',
    bottom: '4px',
    left: '0px', 
    width: '120px',
    height: '3px',
    background: `linear-gradient(90deg, transparent, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, transparent)`,
    boxShadow: `0 0 20px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
    borderRadius: '2px',
    animation: `${horizontalPulse} 5s linear infinite`,
    zIndex: 10,
  },
  formContainer: {
    padding: '20px 24px 24px 24px',
    position: 'relative',
    zIndex: 2,
    transform: 'none',
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    marginBottom: '24px',
    position: 'relative',
    zIndex: 10,
    transform: 'none',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    position: 'relative',
    zIndex: 10,
    transform: 'none',
  },
  button: {
    fontFamily: 'Roboto',
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    minWidth: '100px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transform: 'none', 
    '&:hover': {
      transform: 'translateY(-1px)', 
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      '&:hover': {
        transform: 'none',
      },
    },
  },
  cancelButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
        transform: 'none',
      },
    },
  },
  confirmButton: {
    background: `linear-gradient(135deg, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, ${theme.colors[theme.primaryColor][6]})`,
    border: `1px solid ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15), 0 0 12px ${theme.colors[theme.primaryColor][8]}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.colors[theme.primaryColor][5]}, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]})`,
      boxShadow: `0 4px 16px rgba(0, 0, 0, 0.2), 0 0 20px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
      transform: 'translateY(-1px) scale(1.02)',
    },
  },
}));

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const [preWarm, setPreWarm] = React.useState(false); // Pre-warm glassmorphism
  const [isExiting, setIsExiting] = React.useState(false);
  const { locale } = useLocales();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  // Enable glassmorphism when dialog is visible OR pre-warming
  useConditionalGlassmorphism(Boolean(visible || preWarm), 'InputDialog');

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    // Pre-warm glassmorphism for instant canvas availability
    setPreWarm(true);
    setFields(data);
    setIsExiting(false);
    
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? // Set date to current one if default is set to true
                  row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default ? new Date(row.default).getTime() : null
                : row.default
              : row.checked,
        } || { value: null }
      );
      // Backwards compat with new Select data type
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
    
    // Small delay to ensure canvas is ready, then show dialog
    setTimeout(() => {
      setVisible(true);
      setPreWarm(false); // Stop pre-warming, visible takes over
    }, 50); // 50ms pre-warm for instant appearance
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setIsExiting(true);
    setPreWarm(false); // Stop pre-warming
    setTimeout(async () => {
      setVisible(false);
      setIsExiting(false);
      await new Promise((resolve) => setTimeout(resolve, 200));
      form.reset();
      fieldForm.remove();
      if (dontPost) return;
      fetchNui('inputData');
    }, 250);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsExiting(true);
    setTimeout(async () => {
      setVisible(false);
      const values: any[] = [];
      for (let i = 0; i < fields.rows.length; i++) {
        const row = fields.rows[i];

        if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
          if (!data.test[i]) continue;
          data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
        }
      }
      Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
      await new Promise((resolve) => setTimeout(resolve, 200));
      form.reset();
      fieldForm.remove();
      setIsExiting(false);
      fetchNui('inputData', values);
    }, 250);
  });

  return (
    <>
      <Modal
        opened={visible}
        centered
        size="md"
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        onClose={() => handleClose()}
        withCloseButton={false}
        classNames={{
          overlay: classes.overlay,
        }}
        styles={{
          modal: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
        transition="fade"
        transitionDuration={800}
        title={null} // Remove default title
      >
        {/* Custom container with proper glassmorphism */}
        <Box 
          className={cx(
            classes.container,
            {
              [classes.containerEntering]: !isExiting,
              [classes.containerExiting]: isExiting,
            }
          )}
        >
          {/* Header with title and moving horizontal pulse */}
          <div className={classes.header}>
            <div className={classes.title}>
              {fields.heading}
            </div>
            {/* Horizontal moving pulse under title */}
            <div className={classes.horizontalPulse} />
          </div>

          <div className={classes.formContainer}>
            <form onSubmit={onSubmit}>
              <div className={classes.fieldsContainer}>
                {fieldForm.fields.map((item, index) => {
                  const row = fields.rows[index];
                  return (
                    <React.Fragment key={item.id}>
                      {row.type === 'input' && (
                        <InputField
                          register={form.register(`test.${index}.value`, { required: row.required })}
                          row={row}
                          index={index}
                        />
                      )}
                      {row.type === 'checkbox' && (
                        <CheckboxField
                          register={form.register(`test.${index}.value`, { required: row.required })}
                          row={row}
                          index={index}
                        />
                      )}
                      {(row.type === 'select' || row.type === 'multi-select') && (
                        <SelectField row={row} index={index} control={form.control} />
                      )}
                      {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                      {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                      {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                      {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                      {row.type === 'date' || row.type === 'date-range' ? (
                        <DateField control={form.control} row={row} index={index} />
                      ) : null}
                      {row.type === 'textarea' && (
                        <TextareaField
                          register={form.register(`test.${index}.value`, { required: row.required })}
                          row={row}
                          index={index}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              
              <div className={classes.buttonsContainer}>
                <button 
                  type="button"
                  className={cx(classes.button, classes.cancelButton)}
                  onClick={() => handleClose()}
                  disabled={fields.options?.allowCancel === false}
                >
                  {locale.ui.cancel}
                </button>
                <button
                  type="submit"
                  className={cx(classes.button, classes.confirmButton)}
                >
                  {locale.ui.confirm}
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default InputDialog;
