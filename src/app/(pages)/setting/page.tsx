"use client";

import PageContainer from "@/components/styled-components/page-container";

import React from "react";
import NodeIdSetter from "./_components/NodeIdSetter";
// import { Typography } from "@mui/material";
import SaveParameterButton from "./_components/SaveParameterButton";

export default function Home() {


  return (
    <>
      <PageContainer title="Setting">

        <NodeIdSetter />

        <SaveParameterButton sx={{my: 2}} size="small" variant="contained"/>

      </PageContainer>
    </>
  );
}
