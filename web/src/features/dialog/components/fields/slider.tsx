import { Box, Slider, Text, createStyles } from '@mantine/core';
import { ISlider } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { useEffect } from 'react';

interface Props {
  row: ISlider;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 500,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
  },
  slider: {
    '& .mantine-Slider-markLabel': {
      color: 'rgba(255, 255, 255, 0.9) !important',
      fontFamily: 'Roboto !important',
      fontSize: '12px !important',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4) !important',
    },
    '& .mantine-Slider-mark': {
      '& .mantine-Slider-markLabel': {
        color: 'rgba(255, 255, 255, 0.9) !important',
        fontFamily: 'Roboto !important',
        fontSize: '12px !important',
        fontWeight: 500,
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.4) !important',
      },
    },
    '& [data-mantine-mark-label]': {
      color: 'rgba(255, 255, 255, 0.9) !important',
      fontFamily: 'Roboto !important',
      fontSize: '12px !important',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4) !important',
    },
    '& .mantine-Slider-mark:first-child .mantine-Slider-markLabel': {
      color: 'rgba(255, 255, 255, 0.9) !important',
      fontFamily: 'Roboto !important',
      fontSize: '12px !important',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4) !important',
    },
  },
}));

const SliderField: React.FC<Props> = (props) => {
  const { classes } = useStyles();
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default || props.row.min || 0,
  });

  useEffect(() => {
    // Force style injection for slider mark labels
    const style = document.createElement('style');
    style.textContent = `
      .mantine-Slider-markLabel {
        color: rgba(255, 255, 255, 0.9) !important;
        font-family: Roboto !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box>
      <Text className={classes.label}>{props.row.label}</Text>
      <Slider
        className={classes.slider}
        mb={10}
        value={controller.field.value}
        name={controller.field.name}
        ref={controller.field.ref}
        onBlur={controller.field.onBlur}
        onChange={controller.field.onChange}
        defaultValue={props.row.default || props.row.min || 0}
        min={props.row.min}
        max={props.row.max}
        step={props.row.step}
        disabled={props.row.disabled}
        styles={{
          markLabel: {
            color: 'rgba(255, 255, 255, 0.9) !important',
            fontFamily: 'Roboto !important',
            fontSize: '12px !important',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4) !important',
          },
        }}
        marks={[
          { value: props.row.min || 0, label: String(props.row.min || 0) },
          { value: props.row.max || 100, label: String(props.row.max || 100) },
        ]}
      />
    </Box>
  );
};

export default SliderField;
