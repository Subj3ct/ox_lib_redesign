import { IColorInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { ColorPicker, createStyles } from '@mantine/core';
import LibIcon from '../../../../components/LibIcon';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  row: IColorInput;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  // Custom color input styling to match glassmorphism theme
  colorInput: {
    position: 'relative',
  },

  inputField: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '8px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    padding: '8px 36px 8px 12px',
    width: '100%',
    outline: 'none',
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

  inputLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 500,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
    marginBottom: '6px',
    display: 'block',
  },

  colorSwatch: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
  },

  // Custom dropdown that slides out to the right (same as select)
  customDropdown: {
    position: 'fixed',
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    zIndex: 999999,
    transformOrigin: 'left top',
    padding: '16px',
    width: '280px', // Fixed width for proper size
    
    // Animation keyframes (same as select)
    '@keyframes slideUnfold': {
      '0%': {
        transform: 'translateX(-20px) scaleY(0.3)',
        opacity: 0,
      },
      '60%': {
        transform: 'translateX(0) scaleY(0.8)',
        opacity: 0.8,
      },
      '100%': {
        transform: 'translateX(0) scaleY(1)',
        opacity: 1,
      },
    },
    
    '@keyframes slideFold': {
      '0%': {
        transform: 'translateX(0) scaleY(1)',
        opacity: 1,
      },
      '40%': {
        transform: 'translateX(0) scaleY(0.3)',
        opacity: 0.8,
      },
      '100%': {
        transform: 'translateX(-20px) scaleY(0)',
        opacity: 0,
      },
    },

    // Style the color picker
    '& .mantine-ColorPicker-root': {
      backgroundColor: 'transparent',
      border: 'none',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    '& .mantine-ColorPicker-saturation': {
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      width: '224px',
      height: '180px',
      marginBottom: '12px',
    },
    '& .mantine-ColorPicker-slider': {
      marginBottom: '8px',
      width: '224px',
      '& .mantine-ColorPicker-sliderOverlay': {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        height: '16px',
      },
    },
    '& .mantine-ColorPicker-alpha': {
      width: '200px',
      '& .mantine-ColorPicker-sliderOverlay': {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        height: '16px',
      },
    },
    '& .mantine-ColorPicker-preview': {
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      width: '248px',
    },
    '& .mantine-ColorPicker-swatches': {
      marginTop: '8px',
      width: '248px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      '& .mantine-ColorSwatch-root': {
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
    },
  },
}));

const ColorField: React.FC<Props> = (props) => {
  const { classes, theme } = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Get theme color as default
  const getDefaultColor = () => {
    if (props.row.default) return props.row.default;
    return theme.colors[theme.primaryColor][theme.fn.primaryShade()];
  };

  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: getDefaultColor(),
    rules: { required: props.row.required },
  });

  // Calculate dropdown position (same as select)
  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
        left: rect.right + 12, // 12px gap to the right
      });
    }
  };

  const closeDropdown = useCallback(() => {
    if (isOpen && !isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 250); // Match animation duration
    }
  }, [isOpen, isClosing]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      calculateDropdownPosition();
      setIsOpen(true);
    }
  };

  return (
    <div className={classes.colorInput}>
      {props.row.label && (
        <label className={classes.inputLabel}>
          {props.row.label}
          {props.row.required && <span style={{ color: '#fa5252' }}> *</span>}
        </label>
      )}
      
      <div ref={inputRef} style={{ position: 'relative' }}>
        <input
          type="text"
          value={controller.field.value || ''}
          onChange={(e) => controller.field.onChange(e.target.value)}
          onClick={toggleDropdown}
          className={classes.inputField}
          placeholder={props.row.placeholder || 'Select a color...'}
          disabled={props.row.disabled}
        />
        
        <div 
          className={classes.colorSwatch}
          style={{ backgroundColor: controller.field.value || getDefaultColor() }}
          onClick={toggleDropdown}
        />
        
        {(isOpen || isClosing) && createPortal(
          <div 
            ref={dropdownRef}
            className={classes.customDropdown}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              animation: isClosing 
                ? 'slideFold 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                : 'slideUnfold 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          >
            <ColorPicker
              format={props.row.format || 'hex'}
              value={controller.field.value || getDefaultColor()}
              onChange={controller.field.onChange}
              withPicker={true}
              size="md"
              swatches={[
                '#25262b',
                '#868e96',
                '#fa5252',
                '#e64980',
                '#be4bdb',
                '#7950f2',
                '#4c6ef5',
                '#228be6',
                '#15aabf',
                '#12b886',
                '#40c057',
                '#82c91e',
                '#fab005',
                '#fd7e14',
                theme.colors[theme.primaryColor][theme.fn.primaryShade()],
              ]}
            />
          </div>,
          document.body
        )}
      </div>
      
      {props.row.description && (
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontFamily: 'Roboto', 
          fontSize: '12px',
          marginTop: '4px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          {props.row.description}
        </div>
      )}
    </div>
  );
};

export default ColorField;
