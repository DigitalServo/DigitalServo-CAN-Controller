"use client";

import React from "react";

import NumericForm from "@/components/styled-components/form/NumericField";
import { FormProvider, useForm } from "react-hook-form";
import { Box, BoxProps, Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useNodeIdStore } from "@/stores/nodeId";
import { useSnackbar } from "notistack";
import { P2PControlReference, useControlReferenceStore } from "@/stores/controlReference";

const DEFAULT_VALUE: P2PControlReference = {
  distanceRad: 0.0,
  durationS: 1.0,
};

const TypedNumericForm = NumericForm as typeof NumericForm<P2PControlReference>;

export default function FormForP2PControlReference(props: BoxProps) {

  const { enqueueSnackbar } = useSnackbar();
  const { nodeId } = useNodeIdStore();

  const [busy, setBusy] = React.useState<boolean>(false);

  const { p2pControlReference, setP2PControlReference } = useControlReferenceStore();

  const methods = useForm<P2PControlReference>({
    defaultValues: p2pControlReference ?? DEFAULT_VALUE
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: P2PControlReference) => {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    if (busy == true ){
      enqueueSnackbar("Another task running", { variant: "error" });
      return;
    }

    for (const key in data) {
      if (String(data[key as keyof P2PControlReference]).trim().length == 0) {
        enqueueSnackbar("Empty Form Exists", { variant: "error" });
        return;
      };
    }

    const command: P2PControlReference = {
      distanceRad: Number(data.distanceRad),
      durationS: Number(data.durationS),
    }

    setP2PControlReference(command);

    setBusy(true);
    invoke<null>("cands_send_p2p_control_command", { nodeId, command })
      .catch(err => enqueueSnackbar(err, { variant: "error" }))
      .finally(() => setBusy(false))
  }

  return (
    <>
      <Box {...props}>
        <FormProvider {...methods}>
          <Box component="form" display="block" sx={{width: 600}} onSubmit={handleSubmit(onSubmit)}>

            <Box display="flex" sx={{ mb: 1.5 }}>
              <Box sx={{width: 300}} display="flex">
                <Box sx={{width: "50%", pl: 1}}>
                  <TypedNumericForm name="distanceRad" size="small" suffix="rad" label="Angle" />
                </Box>

                <Box sx={{ width: "50%", pl: 1 }}>
                  <TypedNumericForm name="durationS" size="small" suffix="s" label="Duration"/>
                </Box>
              </Box>

              <Button variant="contained" color="primary" type="submit" sx={{ ml: 1 }}>
                Send
              </Button>

            </Box>

          </Box>
        </FormProvider>
      </Box>
    </>
  );
}
