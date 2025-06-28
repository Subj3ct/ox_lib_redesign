import { createStyles, PasswordInput, TextInput } from '@mantine/core';
import React from 'react';
import { IInput } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: IInput;
  index: number;
}

const useStyles = createStyles((theme) => ({
  eyeIcon: {
    color: theme.colors.dark[2],
  },
  // Custom input styling to match glassmorphism theme
  input: {
    '& .mantine-TextInput-input, & .mantine-PasswordInput-input': {
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
    '& .mantine-TextInput-label, & .mantine-PasswordInput-label': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      marginBottom: '6px',
    },
    '& .mantine-TextInput-description, & .mantine-PasswordInput-description': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: 'Roboto',
      fontSize: '12px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    '& .mantine-TextInput-required, & .mantine-PasswordInput-required': {
      color: theme.colors.red[4],
    },
    '& .mantine-PasswordInput-visibilityToggle': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
}));

const InputField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.input}>
      {!props.row.password ? (
        <TextInput
          {...props.register}
          defaultValue={props.row.default}
          label={props.row.label}
          description={props.row.description}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          placeholder={props.row.placeholder}
          minLength={props.row.min}
          maxLength={props.row.max}
          disabled={props.row.disabled}
          withAsterisk={props.row.required}
        />
      ) : (
        <PasswordInput
          {...props.register}
          defaultValue={props.row.default}
          label={props.row.label}
          description={props.row.description}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          placeholder={props.row.placeholder}
          minLength={props.row.min}
          maxLength={props.row.max}
          disabled={props.row.disabled}
          withAsterisk={props.row.required}
          visibilityToggleIcon={({ reveal, size }) => (
            <LibIcon
              icon={reveal ? 'eye-slash' : 'eye'}
              fontSize={size}
              cursor="pointer"
              className={classes.eyeIcon}
              fixedWidth
            />
          )}
        />
      )}
    </div>
  );
};

export default InputField;
