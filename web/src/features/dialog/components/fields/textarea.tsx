import { Textarea, createStyles } from '@mantine/core';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ITextarea } from '../../../../typings/dialog';
import React from 'react';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: ITextarea;
  index: number;
}

const useStyles = createStyles((theme) => ({
  // Custom textarea styling to match glassmorphism theme
  textarea: {
    '& .mantine-Textarea-input': {
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
      lineHeight: 1.4,
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
    '& .mantine-Textarea-label': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      marginBottom: '6px',
    },
    '& .mantine-Textarea-description': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: 'Roboto',
      fontSize: '12px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    '& .mantine-Textarea-required': {
      color: theme.colors.red[4],
    },
  },
}));

const TextareaField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.textarea}>
      <Textarea
        {...props.register}
        defaultValue={props.row.default}
        label={props.row.label}
        description={props.row.description}
        icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
        placeholder={props.row.placeholder}
        disabled={props.row.disabled}
        withAsterisk={props.row.required}
        autosize={props.row.autosize}
        minRows={props.row.min}
        maxRows={props.row.max}
      />
    </div>
  );
};

export default TextareaField;
