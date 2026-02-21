"use client";

import React from "react";

import { Avatar, IconButton, Tooltip } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useSnackbar } from "notistack";

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNodeIdStore } from "@/stores/nodeId";
import { useCanConnectionStore } from "@/stores/canConnection";

export default function DriveStatusControl() {

  const { enqueueSnackbar } = useSnackbar();
  const { nodeId } = useNodeIdStore();
  const { connected } = useCanConnectionStore();

  const [driveStatus, setDriveStatus] = React.useState<boolean>(false);

  async function tryEnableServo(): Promise<void> {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" })
      return;
    }
    await invoke("cands_drive_enable", { nodeId })
      .then(() => {
        enqueueSnackbar("Enable Servo", { variant: "success" });
        setDriveStatus(true);
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  async function tryDisableServo(): Promise<void> {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" })
      return;
    }
    await invoke("cands_drive_disable", { nodeId })
      .then(() => {
        enqueueSnackbar("Disable Servo", { variant: "default"});
        setDriveStatus(false);
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  async function tryToggleConnection(): Promise<void> {
    await (driveStatus ? tryDisableServo() : tryEnableServo())
  }

  React.useEffect(() => {

    let task: ReturnType<typeof setTimeout> | undefined = undefined;

    if (connected == true && nodeId != null && nodeId != Number.NaN) {
      async function checkDriveStatus(): Promise<void> {
        invoke<boolean>("cands_check_drive_status", { nodeId })
          .then(setDriveStatus)
          .catch(console.log);
      };

      checkDriveStatus();
      task = setInterval(checkDriveStatus, 1000);
    };

    return () => {
      if (task) clearInterval(task);
    }
  }, [nodeId, connected]);

  return (
    <>
      <Tooltip title={ driveStatus? "Drive" : "Paused"} placement="bottom">
        <IconButton onClick={tryToggleConnection} disableRipple disableFocusRipple disableTouchRipple>
          <Avatar sx={{bgcolor: driveStatus ? "#0082FC" : "#ccc", width: 28, height: 28, transition: 'background-color 0.6s ease'}}>
            <PlayArrowIcon fontSize="small" sx={{ color: driveStatus ? "#fff" : "#aaa", transition: 'color 0.6s ease' }} />
          </Avatar>
        </IconButton>
      </Tooltip>
    </>
  );
}
