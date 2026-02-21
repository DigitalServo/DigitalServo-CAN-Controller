'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';

import { HEADER_HEIGHT, HEADER_COLOR, SIDEBAR_WIDTH } from '../globalSetting';
import { Divider, Stack } from '@mui/material';

import PageController from './_components/PageController';
import ConnectionControl from './_components/CanConnection';
import DriveStatusControl from './_components/DriveStatus';
import NodeIdSelector from './_components/NodeIdSelector';
import DriveModeSelector from './_components/DriveModeSelector';


function SectionDivider (): React.ReactNode {
  return (
    <Divider orientation='vertical' flexItem sx={{ bgcolor: "#ddd", my: 1.5 }} />
  )
}

export default function Header() {

  return (
    <>
      <CssBaseline />

      {/* <AppBar color='transparent' elevation={0}> */}
      <AppBar sx={{bgcolor: "#f3f5f6", borderTop: "1pt solid #ccc"}} elevation={1}>

        <Toolbar
          disableGutters
          style={{
            minHeight: 0,
            height: HEADER_HEIGHT,
            backgroundColor: HEADER_COLOR,
            paddingLeft: SIDEBAR_WIDTH + 12,
            paddingRight: 8,
            userSelect: 'none',
            cursor: 'default',
          }}
        >

          {/* Page transition button */}
          <PageController />

					{/* Flex box for padding  */}
          <Box sx={{ flexGrow: 1, display: 'flex'}} />

          {/* Operation area  */}
          <Box sx={{ flexGrow: 0 }} display='flex' alignItems='center'>

            <NodeIdSelector />
            <SectionDivider />

            <DriveModeSelector />
            <SectionDivider />

						{/* Configurations */}
            <Box display="flex" alignItems='center' sx={{mx: 0.5}}>
              <Stack direction='row' spacing={0} display="flex" alignItems='center'>
                <ConnectionControl />
                <DriveStatusControl />
              </Stack>
            </Box>

          </Box>

        </Toolbar>
      </AppBar>

    </>
  );
}
