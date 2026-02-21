'use client'

import { Box, IconButton, Stack } from "@mui/material"
import { useRouter } from "next/navigation";
import { LabeledIcon } from "./Icon";

import PageBackIcon from '@mui/icons-material/ArrowBackIosNew';
import PageForwardIcon from '@mui/icons-material/ArrowForwardIos';

export default function Component () {

  const router = useRouter();

  return (
    <Box>
      <Stack direction='row' spacing={1} display='flex' alignItems='center'>
      <IconButton onClick={() => router.back()} size='small' sx={{borderRadius: 2}}>
        <LabeledIcon title={"Page back"} icon={PageBackIcon} fontSize='small'/>
      </IconButton>

      <IconButton onClick={() => router.forward()} size='small' sx={{borderRadius: 2}}>
        <LabeledIcon title={"Page forward"} icon={PageForwardIcon} fontSize='small'/>
      </IconButton>
      </Stack>
    </Box>
  )
}
