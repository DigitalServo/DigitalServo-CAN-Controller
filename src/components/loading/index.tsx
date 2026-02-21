import { Box, CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <CircularProgress color="primary" size={60} />
    </Box>
  )
}
