import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  borderRadius: 5,
  backgroundColor: alpha('#777', 0.15),
  '&:hover': {
    backgroundColor: alpha('#777', 0.15),
  },
  marginLeft: 0,
  width: 'auto',
  [theme.breakpoints.up('sm')]: {
    marginLeft: 0,
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.8, 1, 0.8, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const SearchBar = (props: {action: (key: string) => void}): React.ReactElement=> {

  const { action } = props;

  const [composing, setComposition] = useState(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);

  const eventHandler = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !composing) {
      const keyword: string = (event.target as HTMLInputElement).value;
      action(keyword);
    }
  };

  return (
    <div style={{display: 'flex'}}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onKeyDown={eventHandler}
          onCompositionStart={startComposition}
          onCompositionEnd={endComposition}
        />
      </Search>
    </div>
  )
}
