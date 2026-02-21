"use client";

import React from "react";

import { Box, BoxProps, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useNodeIdStore } from "@/stores/nodeId";
import { useSnackbar } from "notistack";


export default function IncrementModeSelector (props: BoxProps) {

  const { enqueueSnackbar } = useSnackbar();
  const { nodeId } = useNodeIdStore();

  const [mode, setMode] = React.useState<string>("false");

  const handleChange = (event: SelectChangeEvent<string>) => {
    setMode(event.target.value);
  };

  const onSet = () => {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    invoke<null>("cands_set_p2p_increment_mode", { nodeId, mode: mode === "true" })
      .then(_ => enqueueSnackbar("Set Incremental Mode", { variant: "success" }))
      .catch(err => enqueueSnackbar(err, { variant: "error" }));
  }

  return (
    <>
      <Box {...props} display="flex">
        <Box sx={{width: 300}} display="flex">
          <FormControl fullWidth size="small" sx={{ ml: 1 }}>
            <InputLabel id="p2p-increment-mode-select-label">Mode</InputLabel>
            <Select
              labelId="p2p-increment-mode-select-label"
              id="p2p-increment-mode"
              value={mode}
              label="Mode"
              onChange={handleChange}
            >
              <MenuItem value="true">Increment</MenuItem>
              <MenuItem value="false">Absolute</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" color="primary" sx={{ ml: 1 }} onClick={onSet}>
          Set
        </Button>
      </Box>

    </>
  );
}
