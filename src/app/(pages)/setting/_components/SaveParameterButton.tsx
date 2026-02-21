import React from "react";

import { useNodeIdStore } from "@/stores/nodeId";
import { invoke } from "@tauri-apps/api/core";
import { useSnackbar } from "notistack";
import { Button, ButtonProps } from "@mui/material";



export default function SaveParameterButton(props: ButtonProps): React.ReactElement {

  const { enqueueSnackbar } = useSnackbar();
  const { nodeId } = useNodeIdStore();

  const onClick = (): void => {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    invoke<null>("cands_save_parameters", { nodeId })
      .then(_ => {
        enqueueSnackbar(`Parameters of Node ID ${nodeId} Saved`, { variant: "success" });
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  return (
    <>
      <Button {...props} onClick={onClick}>
        Save
      </Button>
    </>
  )
}
