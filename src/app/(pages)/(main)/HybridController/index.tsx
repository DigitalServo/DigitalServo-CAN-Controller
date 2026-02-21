"use client";

import React from "react";
import FormForHybridControl from "./ControlReference";
import { Typography } from "@mui/material";

export default function HybridController () {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{mb: 2.5, userSelect: "none"}}> Hybrid Control Reference </Typography>
      <FormForHybridControl />
    </>
  );
}
