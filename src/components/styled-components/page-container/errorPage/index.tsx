import { Box, SxProps, Typography } from "@mui/material"
import React from "react";

const FADEIN_DURATION_MS = 600;
const FADEIN_ICON_DELAY_MS = 200;
const FADEIN_DESCR_DELAY_MS = FADEIN_ICON_DELAY_MS + 300;

export type ErrorPageProps = {
  icon: React.FC<React.SVGProps<SVGElement>>,
  sx: SxProps,
  errorNumber: number,
  errorText: string
};

export default function ErrorPage (props: ErrorPageProps): React.ReactElement {

  const [iconRendering, setIconRendering] = React.useState<boolean>(false);
  const [descrRendering, setDescrRendering] = React.useState<boolean>(false);

  React.useEffect(() => {
    const task1 = setTimeout(() => setIconRendering(true), FADEIN_ICON_DELAY_MS);
    const task2 = setTimeout(() => setDescrRendering(true), FADEIN_DESCR_DELAY_MS);

    return () => {
      if (task1) clearTimeout(task1);
      if (task2) clearTimeout(task2);
    }
  }, []);

  const icon_opacity = iconRendering? 1 : 0;
  const descr_opacity = descrRendering? 1 : 0;

  const transition = `${FADEIN_DURATION_MS}ms ease`;

  return (
    <Box display="flex" flexDirection="column" sx={{width: '100%'}} justifyContent='center' alignItems="center" >

      <Box sx={{opacity: icon_opacity, transition}}>
        <Box sx={props.sx}>
          <props.icon />
        </Box>
      </Box>

      <Box sx={{opacity: descr_opacity, transition}}>
        <Box display='flex' sx={{width: '100%', userSelect: 'none' }} justifyContent='center' alignItems="center">
          <Box sx={{borderRight: '1px solid #aaa', pr: 2, mr: 2}}>
            <Typography variant='h5'> {props.errorNumber} </Typography>
          </Box>
          <Typography variant='subtitle1'> {props.errorText} </Typography>
        </Box>
      </Box>

    </Box>
  )
}
