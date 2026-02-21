"use client";

import React from "react";

import NumericForm from "@/components/styled-components/form/NumericField";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useNodeIdStore } from "@/stores/nodeId";
import { useSnackbar } from "notistack";
import { HybridControlReference, useControlReferenceStore } from "@/stores/controlReference";

const DEFAULT_VALUE: HybridControlReference = {
  torqueFeedforward: 0,
  positionReference: 0,
  velocityReference: 0,
  torqueReference: 0,
  positionGain: 0,
  velocityGain: 0,
  torqueGain: 0,
  torqueLimit: 2.0,
};

const TypedNumericForm = NumericForm as typeof NumericForm<HybridControlReference>;

export default function FormForHybridControl() {

  const { enqueueSnackbar } = useSnackbar();
  const { nodeId } = useNodeIdStore();

  const { hybridControlReference, setHybridControlReference } = useControlReferenceStore();

  const methods = useForm<HybridControlReference>({
    defaultValues: hybridControlReference ?? DEFAULT_VALUE
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: HybridControlReference) => {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    for (const key in data) {
      if (String(data[key as keyof HybridControlReference]).trim().length == 0) {
        enqueueSnackbar("Empty Form Exists", { variant: "error" });
        return;
      };
    }

    const parameters: HybridControlReference = {
      torqueFeedforward: Number(data.torqueFeedforward),
      positionReference: Number(data.positionReference),
      velocityReference: Number(data.velocityReference),
      torqueReference: Number(data.torqueReference),
      positionGain: Number(data.positionGain),
      velocityGain: Number(data.velocityGain),
      torqueGain: Number(data.torqueGain),
      torqueLimit: Number(data.torqueLimit),
    }

    setHybridControlReference(parameters);

    invoke<null>("cands_send_hybrid_control_parameter", { nodeId, parameters })
      .catch(err => enqueueSnackbar(err, { variant: "error" }));
  }

  function resetPositionData() {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    invoke<null>("cands_reset_position_encoder", { nodeId })
      .catch(err => enqueueSnackbar(err, { variant: "error" }));
  }

  function sendZeroParameters() {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    const parameters: HybridControlReference = {
      torqueFeedforward: Number(0.0),
      positionReference: Number(0.0),
      velocityReference: Number(0.0),
      torqueReference: Number(0.0),
      positionGain: Number(0.0),
      velocityGain: Number(0.0),
      torqueGain: Number(0.0),
      torqueLimit: Number(0.0),
    }

    invoke<null>("cands_send_hybrid_control_parameter", { nodeId, parameters })
      .catch(err => enqueueSnackbar(err, { variant: "error" }));
  }

  return (
    <>
      <FormProvider {...methods}>
        <Box component="form" display="block" sx={{width: 600}} onSubmit={handleSubmit(onSubmit)}>

          <Box display="flex" sx={{ mb: 1.5}}>
            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="positionReference" size="small" suffix="rad" label="Position command"/>
            </Box>

            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="velocityReference" size="small" suffix="rad/s" label="Velocity command" />
            </Box>

            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="torqueReference" size="small" suffix={<>N&middot;m</>} label="torquer command" />
            </Box>

            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="torqueFeedforward" size="small" suffix={<>N&middot;m</>} label="Torque feedforward" />
            </Box>
          </Box>

          <Box display="flex" sx={{ mb: 1.5 }}>
            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="positionGain" size="small" label="Position gain" />
            </Box>

            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="velocityGain" size="small" label="Velocity gain" />
            </Box>

            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="torqueGain" size="small" label="Torque gain" />
            </Box>

            <Box sx={{width: "25%", pl: 1}}>
              <TypedNumericForm name="torqueLimit" size="small" suffix={<>N&middot;m</>} label="Torque limit" />
            </Box>
          </Box>

          <Box display="flex" justifyContent="end">
            <Button variant="contained" color="primary" onClick={resetPositionData} sx={{ ml: 0.5 }}>
              Reset ENC
            </Button>

            <Button variant="contained" color="primary" onClick={sendZeroParameters} sx={{ ml: 0.5 }}>
              Stop
            </Button>

            <Button variant="contained" color="primary" type="submit" sx={{ ml: 0.5 }}>
              Send
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </>
  );
}
