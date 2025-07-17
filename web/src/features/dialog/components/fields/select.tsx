import { MultiSelect, Select, createStyles } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  // Custom select styling to match glassmorphism theme
  select: {
    position: 'relative',
    '& .mantine-Select-input, & .mantine-MultiSelect-input': {
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
    '& .mantine-Select-label, & .mantine-MultiSelect-label': {
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
      marginBottom: '6px',
    },
    '& .mantine-Select-description, & .mantine-MultiSelect-description': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontFamily: 'Roboto',
      fontSize: '12px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    '& .mantine-Select-required, & .mantine-MultiSelect-required': {
      color: theme.colors.red[4],
    },
    '& .mantine-Select-rightSection, & .mantine-MultiSelect-rightSection': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&:hover': {
        color: '#ffffff',
      },
    },
  },
  
  // Custom dropdown that slides out to the right
  customDropdown: {
    position: 'fixed',
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 999999,
    transformOrigin: 'left top',
    padding: '0', // Remove any default padding
    
    // Animation keyframes
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
  },
  
  dropdownItem: {
    padding: '8px 12px', // Match input field height
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'Roboto',
    fontSize: '14px',
    borderRadius: '0px',
    margin: '0',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      '& span': {
        transform: 'translateX(2px)', // Only slide the text, not the background
      },
    },
    
    '&.selected': {
      backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
      border: '2px solid #000000', // Black border for selected items
      color: '#ffffff',
      '&:hover': {
        backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
        opacity: 0.9,
        '& span': {
          transform: 'translateX(2px)', // Only slide the text, not the background
        },
      },
    },
    
    '& span': {
      flex: 1,
      transition: 'transform 0.15s ease',
    },
  },
  
  // Custom input field that we can control
  customInput: {
    position: 'relative',
  },
  
  inputField: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
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

  // Multi-select container for chips
  multiSelectContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '4px 36px 4px 6px', // Add right padding for chevron space
    minHeight: '32px', // Match other input fields
    cursor: 'pointer',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
    alignItems: 'center',
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

  chip: {
    backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '2px 2px 2px 8px', // Shorter padding
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontFamily: 'Roboto',
    fontWeight: 500,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
    width: '100%',
    minHeight: '20px', // Shorter height
  },

  chipText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    flex: 1,
    paddingRight: '4px',
  },

  chipRemove: {
    cursor: 'pointer',
    borderRadius: '50%',
    width: '14px',
    height: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },

  placeholder: {
    color: 'rgba(255, 255, 255, 0.6)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    fontFamily: 'Roboto',
    fontSize: '14px',
    gridColumn: '1 / -1',
    marginLeft: '2px',
    lineHeight: '20px', // Match chip height
  },

  chevronContainer: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'transform 0.2s ease',
    pointerEvents: 'none',
    zIndex: 1,
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
  
  chevron: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'transform 0.2s ease',
    pointerEvents: 'none',
  },
}));

const CustomSelectField: React.FC<Props> = (props) => {
  const { classes, cx } = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedValue, setSelectedValue] = useState(props.row.options?.find(opt => opt.value === props.row.default)?.label || '');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [filterText, setFilterText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  // Multi-select specific logic
  const isMultiSelect = props.row.type === 'multi-select';
  const selectedValues = isMultiSelect ? (controller.field.value || []) : [];
  
  const getDisplayValue = () => {
    if (isMultiSelect) {
      return ''; // We'll show chips instead
    }
    return isOpen ? filterText : selectedValue;
  };

  // Get selected options for chips
  const getSelectedOptions = () => {
    if (!isMultiSelect) return [];
    return selectedValues.map((value: any) => 
      props.row.options?.find(opt => opt.value === value)
    ).filter(Boolean);
  };

  // Remove chip function
  const removeChip = (valueToRemove: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening dropdown
    const newValues = selectedValues.filter((val: any) => val !== valueToRemove);
    controller.field.onChange(newValues);
  };

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
        left: rect.right + 12, // 12px gap to the right
        width: rect.width, // Match input field width
      });
    }
  };

  const closeDropdown = useCallback(() => {
    if (isOpen && !isClosing) {
      setIsClosing(true);
      setFilterText(''); // Clear filter when closing
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

  const handleItemClick = (option: any) => {
    if (isMultiSelect) {
      const currentValues = controller.field.value || [];
      const isSelected = currentValues.includes(option.value);
      
      let newValues;
      if (isSelected) {
        // Remove from selection
        newValues = currentValues.filter((val: any) => val !== option.value);
      } else {
        // Add to selection (check max limit)
        if (props.row.maxSelectedValues && currentValues.length >= props.row.maxSelectedValues) {
          return; // Don't add if max reached
        }
        newValues = [...currentValues, option.value];
      }
      
      controller.field.onChange(newValues);
      // Don't close dropdown for multi-select
    } else {
    setSelectedValue(option.label);
    controller.field.onChange(option.value);
    closeDropdown();
    }
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      calculateDropdownPosition();
      setIsOpen(true);
      setFilterText(''); // Reset filter when opening
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Find first matching option and select it
      const filteredOptions = props.row.options?.filter(option => 
        option.label?.toLowerCase().includes(filterText.toLowerCase())
      ) || [];
      
      if (filteredOptions.length > 0) {
        handleItemClick(filteredOptions[0]);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  };

  return (
    <div className={classes.customInput}>
      {props.row.label && (
        <label className={classes.inputLabel}>
          {props.row.label}
          {props.row.required && <span style={{ color: '#fa5252' }}> *</span>}
        </label>
      )}
      
      <div ref={inputRef} style={{ position: 'relative' }}>
        {isMultiSelect ? (
          // Multi-select container with chips
          <div style={{ position: 'relative' }}>
            <div
              className={classes.multiSelectContainer}
              onClick={toggleDropdown}
            >
              {getSelectedOptions().map((option: any, index: number) => (
                <div key={option.value} className={classes.chip}>
                  <span className={classes.chipText}>{option.label}</span>
                  <div 
                    className={classes.chipRemove}
                    onClick={(e) => removeChip(option.value, e)}
                  >
                    <LibIcon icon="x" style={{ fontSize: '8px' }} />
                  </div>
                </div>
              ))}
              {selectedValues.length === 0 && (
                <span className={classes.placeholder}>
                  {props.row.placeholder || 'Select options...'}
                </span>
              )}
            </div>
            <div 
              className={classes.chevronContainer}
              style={{
                transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)',
              }}
            >
              <LibIcon icon="chevron-down" />
            </div>
          </div>
        ) : (
          // Single select input
          <>
            <input
              type="text"
              value={getDisplayValue()}
              onClick={toggleDropdown}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              readOnly={!isOpen}
              className={classes.inputField}
              placeholder={props.row.placeholder || 'Select an option...'}
              disabled={props.row.disabled}
            />
            
            <div 
              className={classes.chevron}
              style={{
                transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
              }}
            >
              <LibIcon icon="chevron-down" />
            </div>
          </>
        )}
        
        {(isOpen || isClosing) && createPortal(
          <div 
            ref={dropdownRef}
            className={classes.customDropdown}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width, // Match input field width
              animation: isClosing 
                ? 'slideFold 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                : 'slideUnfold 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          >
            {(() => {
              const filteredOptions = props.row.options?.filter(option => 
                option.label?.toLowerCase().includes(filterText.toLowerCase())
              ) || [];
              
              if (filteredOptions.length === 0 && filterText) {
                return (
                  <div className={classes.dropdownItem} style={{ cursor: 'default', opacity: 0.6 }}>
                    <span>No matches</span>
                  </div>
                );
              }
              
              return filteredOptions.map((option, index) => {
                const isSelected = isMultiSelect 
                  ? selectedValues.includes(option.value)
                  : option.value === controller.field.value;
                
                return (
                <div
                  key={index}
                  className={cx(classes.dropdownItem, { 
                      selected: isSelected 
                  })}
                  onClick={() => handleItemClick(option)}
                >
                  <span>{option.label}</span>
                    {isMultiSelect && isSelected && (
                      <LibIcon icon="check" style={{ marginLeft: 'auto', fontSize: '14px' }} />
                    )}
                </div>
                );
              });
            })()}
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

export default CustomSelectField;
