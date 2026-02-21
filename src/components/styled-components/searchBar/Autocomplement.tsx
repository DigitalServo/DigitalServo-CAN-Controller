"use client";

import { useState, useRef } from 'react';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Box,
  ClickAwayListener,
  styled,
  TextFieldProps,
  CSSObject,
  SvgIconProps,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { StyledComponent } from '@emotion/styled';

type SearchTextFieldProps = TextFieldProps & {
  fontSize?: number | string;
  height?: number | string;
};

const SearchTextField: StyledComponent<SearchTextFieldProps> = styled(TextField)(({ height, fontSize }: SearchTextFieldProps): CSSObject => ({
  '& .MuiOutlinedInput-root': {
    height: height ?? 32,           // propsが渡されなければデフォルト32
    paddingRight: '8px !important',
  },
  '& .MuiAutocomplete-inputRoot': {
    paddingRight: '8px !important',
  },
  '& .MuiInputBase-input': {
      fontSize: fontSize ?? '0.875rem',
    },
}));

export interface OptionBaseProps {
  id: number,
  label: string,
}

export interface SearchBarProps<T extends OptionBaseProps> {
  id?: string,
  height?: number | string,
  strechWidth?: number
  icon?: React.ComponentType<SvgIconProps>,
  iconColor?: string,
  tooltip?: React.ReactNode,
  inputFontSize?: number | string,
  options?: T[],
  shrinkOnSelect?: boolean,
  alwaysOpen?: boolean,
  onSelected?: (option: T) => void
  onCleared?: () => void
}

export default function SearchBar<T extends OptionBaseProps>(props: SearchBarProps<T>) {

  const {
    id = "",
    height = 32,
    strechWidth = 240,
    icon = SearchIcon,
    iconColor,
    tooltip = "Search",
    inputFontSize = '0.875rem',
    shrinkOnSelect = true,
    alwaysOpen = false,
    onSelected,
    onCleared,
  } = props;

  const StartIcon:　React.ComponentType<SvgIconProps> = icon;
  const widthAtShrink: string | number = height;

  const [expanded, setExpanded] = useState<boolean>(alwaysOpen? true : false);
  const [value, setValue] = useState<T | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleClose = () => {
    if (!alwaysOpen && !inputValue.trim()) {
      setValue(null);
      setInputValue('');
      setExpanded(false);
    }
  };

  const forceHandleClose = () => {
    if (!alwaysOpen) {
      setValue(null);
      setInputValue('');
      setExpanded(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setValue(null);
    if (onCleared) onCleared();
  };

  return (
    <>
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        sx={{
          mx: 0,
          display: 'inline-flex',
          alignItems: 'center',
          position: 'relative',
          width: expanded ? strechWidth : widthAtShrink,
          height: height,
          transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          backgroundColor: expanded ? 'action.hover' : 'transparent',
        }}
      >
        {expanded == false && (
          <Tooltip title={tooltip} enterDelay={0}>
            <IconButton size="small" onClick={handleExpand} aria-label="expand search">
                <StartIcon fontSize="small" sx={{ color: iconColor }} />
            </IconButton>
          </Tooltip>
        )}

        <Box
          sx={{
            width: '100%',
            display: expanded ? "block" : "none",
            transition: 'opacity 0.2s ease',
            pointerEvents: expanded ? 'auto' : 'none',
          }}
        >
          <Autocomplete
            id={`autocomplete-search-field-${id}`}
            freeSolo
            value={value}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                setInputValue(newValue);
              }
              setValue(newValue as T | null);
              if (onSelected) onSelected(newValue as T);
            }}
            onClose={(event, reason) => {
              if (shrinkOnSelect && (reason === 'selectOption')) {
                forceHandleClose();
              }
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            options={props.options || []}
            getOptionLabel={(option) => typeof option === 'string' ? option : (option as T)?.label ?? ''}
            isOptionEqualToValue={(option, val) => option.id === val?.id}
            openOnFocus
            autoHighlight
            disableCloseOnSelect={false}
            disableClearable={!inputValue}
            slotProps={{
              popper: {
                sx: { width: 'fit-content' },
              },
              listbox: {
                sx: {
                  fontSize: '0.875rem',
                  '& .MuiAutocomplete-option': {
                    fontSize: 'inherit',
                    py: 0.5,
                  },
                },
              },
            }}
            renderInput={(params) => (
              <SearchTextField
                {...params}
                id={`autocomplete-search-input-${id}`}
                height={height}
                fontSize={inputFontSize}
                inputRef={inputRef}
                placeholder="Search..."
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: 0.5, mr: 0, }}>
                        <StartIcon fontSize="small" sx={{ color: iconColor }}/>
                      </InputAdornment>
                    ),
                    endAdornment: inputValue ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClear}
                          edge="end"
                          aria-label="clear search"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
              />
            )}
          />
        </Box>
      </Box>
      </ClickAwayListener>
    </>
  );
}
