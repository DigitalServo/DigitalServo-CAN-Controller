"use client";

import React from "react";
import { Box, BoxProps, styled, Typography, TypographyProps } from "@mui/material";
import { StyledComponent } from "@emotion/styled";
import { useMotionResponseStore } from "@/stores/motionResponse";

const SignDisplay: StyledComponent<TypographyProps> = styled(Typography)({
  width: 14,
  display: "flex",
  justifyContent: "center",
});

function determineSign(value: number): string {
  return value < 0 ? "\u2212" : "\u002b";
}

function ScientificNotation(props: { value?: number, fractionDigits?: number }) {
  const { value: mantissa, fractionDigits = 2 } = props;

  if (mantissa == undefined) return null;

  const [mantissa_abs_str, exponent_str] = Math.abs(mantissa).toExponential(fractionDigits).split("e");

  const mantissa_abs = mantissa_abs_str;
  const mantissa_sign = determineSign(mantissa);

  const exponent = Number(exponent_str);
  const exponent_abs = Math.abs(exponent);
  const exponent_sign = determineSign(exponent);

  return (
    <>
      <SignDisplay> { mantissa_sign } </SignDisplay>
      <Typography> {mantissa_abs} </Typography>
      <Typography sx={{ ml: 0.5 }}> e </Typography>
      <SignDisplay> { exponent_sign } </SignDisplay>
      <Typography> {exponent_abs} </Typography>
    </>
  )
}


function ResponseViewer(props: { title: string, value?: number, fractionDigits?: number } & BoxProps) {
  const { title, value, fractionDigits, ...other } = props;
  return (
    <Box {...other} display="flex">
      <Typography sx={{ width: 70 }}> { title }: </Typography>
      <ScientificNotation value={value} fractionDigits={fractionDigits} />
    </Box>
  )
};

export default function MotionResponse(props: BoxProps & {fractionDigits?: number}) {

  const { motionResponse } = useMotionResponseStore();
  const { sx, fractionDigits, ...other } = props;

  return (
    <>
      <Box sx={{ ...sx, userSelect: "none" }} {...other}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}> Response </Typography>
        <Box sx={{ml: 0.5}}>
          <ResponseViewer sx={{ mb: 0.5 }} title="Position" value={motionResponse?.position} fractionDigits={fractionDigits} />
          <ResponseViewer sx={{ mb: 0.5 }} title="Velocity" value={motionResponse?.velocity} fractionDigits={fractionDigits} />
          <ResponseViewer sx={{ mb: 0.5 }} title="Force" value={motionResponse?.force} fractionDigits={fractionDigits} />
        </Box>
      </Box>
    </>
  );
}
