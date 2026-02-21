import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { SwitchProps } from 'node_modules/@mui/x-data-grid/esm/models/gridBaseSlots';

const SWITCH_HEIGHT: number = 32;
const SWITCH_WIDTH: number = 90;
const SWITCH_MARGIN: number = 2;

const THUMB_HEIGHT: number = SWITCH_HEIGHT - 2 * SWITCH_MARGIN;
const THUMB_WIDTH: number = 48;

const SWITCH_MOVE_DISTANCE: number = SWITCH_WIDTH - THUMB_WIDTH - 2 * SWITCH_MARGIN;

const FONT_SIZE = '12px';

export const InternalTextSwitch: React.FC<SwitchProps> = styled(Switch)(({ theme }) => ({
  width: SWITCH_WIDTH,
  height: SWITCH_HEIGHT,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: SWITCH_MARGIN,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: `translateX(${SWITCH_MOVE_DISTANCE}px)`,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: THUMB_HEIGHT / 2,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: SWITCH_HEIGHT / 2,
    backgroundColor: '#A9A9AA',
    opacity: 1,
    position: 'relative',
    '&::before': {
      content: '"ON"',
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      fontSize: FONT_SIZE,
      fontWeight: 'bold',
    },
    '&::after': {
      content: '"OFF"',
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      fontSize: FONT_SIZE,
      fontWeight: 'bold',
    },
    '.Mui-checked + & .MuiSwitch-track &::before': {
      opacity: 0,
    },
  },
}));
