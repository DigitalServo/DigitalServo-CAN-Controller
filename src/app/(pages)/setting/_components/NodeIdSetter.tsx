import React from "react";

import { useNodeIdStore } from "@/stores/nodeId";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { invoke } from "@tauri-apps/api/core";
import { useSnackbar } from "notistack";
import { Box, Button, TextField } from "@mui/material";

const NODE_ID_MIN: number = 0;
const NODE_ID_MAX: number = 127;

type Inputs = {
  nodeId: number,
};

const defaultValues = {
  nodeId: 0,
}

export default function NodeIdSetter(): React.ReactElement {

  const { enqueueSnackbar } = useSnackbar();
  const { nodeId } = useNodeIdStore();

  const { control, handleSubmit } = useForm<Inputs>({ defaultValues });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    const newNodeId = Number(data.nodeId);
    if (Number.isNaN(newNodeId) || newNodeId < NODE_ID_MIN || newNodeId > NODE_ID_MAX) return;

    invoke<null>("cands_set_node_id", { nodeId, newNodeId })
      .then(_ => {
        enqueueSnackbar(`Set Node ID to ${newNodeId}`, { variant: "success" });
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex">
          <Controller
            name="nodeId"
            control={control}
            rules={{
              required: true,
              min: { value: NODE_ID_MIN, message: `greater than or equal ${NODE_ID_MIN}` },
              max: { value: NODE_ID_MAX, message: `less than or equal ${NODE_ID_MAX}` },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                label="New Node ID"
                sx={{ width: 150 }}
                slotProps={{
                  htmlInput: {sx: {textAlign: "right"} }
                }}
              />
            )}
          />

          <Button type="submit"　size="small" variant="contained" sx={{ml: 1, alignSelf: "center"}}>
            Set
          </Button>
        </Box>
      </Box>
    </>
  )
}
