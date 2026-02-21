import {  SvgIconPropsSizeOverrides, SvgIconTypeMap, Tooltip } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { OverridableStringUnion} from '@mui/types';

export const LabeledIcon = (props: {
    title: string,
    icon: OverridableComponent<SvgIconTypeMap<{ children?: React.ReactNode }, "svg">>,
    color?: string,
    colored?: boolean,
    fontSize?: OverridableStringUnion<'inherit' | 'large' | 'medium' | 'small', SvgIconPropsSizeOverrides>;
}): React.ReactNode => (
  <Tooltip placement='bottom' arrow={true} title={props.title}>
    <props.icon sx={{color: props.colored? (props.color? props.color : "#66f") : "#888"}} fontSize={props.fontSize}/>
  </Tooltip>
)
