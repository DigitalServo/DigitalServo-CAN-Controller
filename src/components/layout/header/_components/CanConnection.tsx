"use client";

import React from "react";

import { Avatar, IconButton, Tooltip } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useSnackbar } from "notistack";

import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import { useCanConnectionStore } from "@/stores/canConnection";

export default function ConnectionControl() {

  const { enqueueSnackbar } = useSnackbar();

  const {connected, setConnected} = useCanConnectionStore()

  async function tryConnect (): Promise<void> {
    await invoke("cands_connect")
      .then(() => {
        enqueueSnackbar("Connected", { variant: "success" });
        setConnected(true);
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  async function tryDisconnect (): Promise<void> {
    await invoke("cands_disconnect")
      .then(() => {
        enqueueSnackbar("Disconnected", { variant: "default"});
        setConnected(false);
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  async function tryToggleConnection(): Promise<void> {
    await (connected ? tryDisconnect() : tryConnect())
  }

  React.useEffect(() => {

    async function checkConnection(): Promise<void> {
      invoke<boolean>("cands_check_connection")
        .then(setConnected)
        .catch(console.log);
    };

    checkConnection();

    const task = setInterval(checkConnection, 1000);
    return () => {
      if (task) clearInterval(task);
    }
  }, [setConnected]);

  return (
    <>
      <Tooltip title={ connected? "Connected" : "Not connected"} placement="bottom">
        <IconButton onClick={tryToggleConnection} disableRipple disableFocusRipple disableTouchRipple>
          <Avatar sx={{bgcolor: connected ? "#0082FC" : "#ccc", width: 28, height: 28, transition: 'background-color 0.6s ease'}}>
            <SettingsInputHdmiIcon fontSize="small" sx={{ color: connected ? "#fff" : "#aaa", transition: 'color 0.6s ease' }} />
          </Avatar>
        </IconButton>
      </Tooltip>
    </>
  );
}
