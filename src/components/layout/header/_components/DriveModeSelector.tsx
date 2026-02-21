"use client";

import React from "react";

import { useSnackbar } from "notistack";
import { Autocomplete, Avatar, IconButton, styled, TextField, TextFieldProps, Tooltip } from "@mui/material";
import { StyledComponent } from "@emotion/styled";
import { DRIVE_MODE_OPTIONS, useDriveModeStore } from "@/stores/driveMode";
import { useNodeIdStore } from "@/stores/nodeId";

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PublishIcon from '@mui/icons-material/Publish';
import { invoke } from "@tauri-apps/api/core";
import { useCanConnectionStore } from "@/stores/canConnection";



const TinyTextField: StyledComponent<TextFieldProps> = styled(TextField)({
  '& .MuiInputBase-root': {
    height: 28,
    width: 210,
  },
  '& .MuiInputBase-input': {
    padding: '2px 6px',
    fontSize: '0.8rem',     // 12px
  },
  '& .MuiInputLabel-root': {
    '&.MuiInputLabel-shrink': {
      transform: 'translate(12px, -8px) scale(0.75)',
    },
    transform: 'translate(12px, 7px) scale(1)',
    fontSize: '0.75rem',
  },
  '& .MuiOutlinedInput-input': {
    textAlign: 'left',
    paddingRight: 8,
  },
  '& .MuiOutlinedInput-input::placeholder': {
    textAlign: 'left',
    paddingLeft: 4,
    opacity: 0.7,
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    fontSize: '0.7em',
  },
});


export default function DriveModeSelector () {

  const { enqueueSnackbar } = useSnackbar();
  const { driveMode, setDriveMode } = useDriveModeStore();
  const { nodeId } = useNodeIdStore();
  const { connected } = useCanConnectionStore();

  async function getdriveModeFromDriver() {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    await invoke<string>("cands_check_control_mode", { nodeId })
      .then(ret => {
        if (DRIVE_MODE_OPTIONS.includes(ret)) {
          setDriveMode(ret);
          enqueueSnackbar(`Mode: ${ret}`, { variant: "success" });
        }
      })
      .catch(err => enqueueSnackbar(err, { variant: "error" }));
  }

  async function setDriveModeToDriver() {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    await invoke<string>("cands_set_control_mode", { nodeId, mode: driveMode })
      .then(_ => {
          enqueueSnackbar(`Set Mode Successfully`, { variant: "success" });
      })
      .catch(err => enqueueSnackbar(err, { variant: "error" }));
  }

  const isGetActive = connected == true && nodeId != null;
  const isSetActive = isGetActive && driveMode != null;

  return (
    <>
      <Autocomplete
        value={String(driveMode || "")}
        options={DRIVE_MODE_OPTIONS}
        sx={{ ml: 1 }}
        slotProps={{
          popper: {
            sx: { width: 'fit-content' },
          },
          listbox: {
            sx: {
              fontSize: '0.875rem',
              textAlign: 'left',
              '& .MuiAutocomplete-option': {
                fontSize: 'inherit',
                py: 0.5,
              },
            },
          },
        }}
        renderInput={(params) => (
          <TinyTextField {...params} label="Control Mode" />
        )}
        onChange={(_: React.SyntheticEvent, mode: string) => {
          setDriveMode(mode)
        }}
        disablePortal
        disableClearable
      />

      <Tooltip title={"Set control mode"} placement="bottom">
        <IconButton onClick={setDriveModeToDriver} disableRipple disableFocusRipple disableTouchRipple sx={{pr: 0.5}}>
          <Avatar sx={{bgcolor: isSetActive? "#0082FC" : "#ccc", width: 28, height: 28, transition: 'background-color 0.6s ease'}}>
            <FileDownloadIcon fontSize="small" sx={{ color: isSetActive? "#fff" : "#aaa", transition: 'color 0.6s ease' }} />
          </Avatar>
        </IconButton>
      </Tooltip>

      <Tooltip title={"Check control mode"} placement="bottom">
        <IconButton onClick={getdriveModeFromDriver} disableRipple disableFocusRipple disableTouchRipple sx={{pl: 0.5}}>
          <Avatar sx={{bgcolor: isGetActive? "#0082FC" : "#ccc", width: 28, height: 28, transition: 'background-color 0.6s ease'}}>
            <PublishIcon fontSize="small" sx={{ color: isGetActive? "#fff" : "#aaa", transition: 'color 0.6s ease' }} />
          </Avatar>
        </IconButton>
      </Tooltip>
    </>
  );
}
