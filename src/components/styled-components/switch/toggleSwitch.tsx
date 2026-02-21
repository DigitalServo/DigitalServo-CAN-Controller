import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { SwitchProps } from 'node_modules/@mui/x-data-grid/esm/models/gridBaseSlots';

const SWITCH_HEIGHT: number = 26;
const SWITCH_WIDTH: number = 50;
const SWITCH_MARGIN: number = 2;

const THUMB_HEIGHT: number = SWITCH_HEIGHT - 2 * SWITCH_MARGIN;
const THUMB_WIDTH: number = THUMB_HEIGHT;

const SWITCH_MOVE_DISTANCE: number = SWITCH_WIDTH - THUMB_HEIGHT - 2 * SWITCH_MARGIN;

export const ToggleSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: SWITCH_WIDTH,
  height: SWITCH_HEIGHT,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: SWITCH_MARGIN,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: `translateX(${SWITCH_MOVE_DISTANCE}px)`,
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
  },
  '& .MuiSwitch-track': {
    borderRadius: SWITCH_HEIGHT / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));
