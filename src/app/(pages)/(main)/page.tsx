"use client";

import React from "react";

import PageContainer from "@/components/styled-components/page-container";
import HybridController from "./HybridController";
import P2PController from "./P2PController";
import MotionResponse from "@/components/motion-response";
import { DriveMode, useDriveModeStore } from "@/stores/driveMode";

export default function Home() {

  const { driveMode }  = useDriveModeStore();


  return (
    <>
      <PageContainer title="Control System">

        {driveMode == DriveMode.HybridControlBiSSCMTL && (<HybridController />)}
        {driveMode == DriveMode.P2PControlBiSSCMTL && (<P2PController />)}

        <MotionResponse sx={{ mt: 1 }} fractionDigits={3}/>

      </PageContainer>
    </>
  );
}
