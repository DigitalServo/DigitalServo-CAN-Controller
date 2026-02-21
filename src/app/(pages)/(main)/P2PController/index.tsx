"use client";

import React from "react";
import FormForP2PControlCommand from "./ControlReference";
import { Typography } from "@mui/material";
import IncrementModeSelector from "./IncrementModeFom";

export default function P2PController () {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2.5, userSelect: "none" }}> P2P Control Reference </Typography>
      <IncrementModeSelector sx={{ mb: 1.5 }} />
      <FormForP2PControlCommand />
    </>
  );
}
