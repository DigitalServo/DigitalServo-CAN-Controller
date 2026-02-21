import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';

import { PrimaryItem } from ".";

export const contentsOperation: PrimaryItem[] = [
  {
    name: "Drive",
    link: "/",
    expand: false,
    navigate: true,
    icon: PlayCircleOutlineIcon,
    minors: [],
  },
  {
    name: "Parameter",
    link: "/parameter",
    expand: false,
    navigate: true,
    icon: TuneIcon,
    minors: [],
  },
  {
    name: "Setting",
    link: "/setting",
    expand: false,
    navigate: true,
    icon: SettingsIcon,
    minors: [],
  },
];
