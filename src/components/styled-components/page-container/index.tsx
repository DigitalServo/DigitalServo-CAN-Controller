"use client"

import React from "react";

import { Box, Typography } from "@mui/material";

const FADEIN_TITLE_DELAY_MS = 150;
const FADEIN_CHILD_DELAY_MS = 200;

const FADEIN_DURATION_MS = 600;

const PageTitle = (props: { title: string }): React.ReactElement => {
  const [pageRendering, setPageRendering] = React.useState<boolean>(false);
  React.useEffect(() => {
    const task = setTimeout(() => setPageRendering(true), FADEIN_TITLE_DELAY_MS);
    return () => { if (task) clearTimeout(task); }
  }, []);
  const opacity = pageRendering? 1 : 0;
  const transition = `${FADEIN_DURATION_MS}ms ease`;
  return (
    <Box sx={{opacity, transition}}>
      <Typography variant='h5' fontWeight='bold' color='#334' sx={{ userSelect: 'none', mb: 3 }}>
        {props.title}
      </Typography>
    </Box>
  )
};

const PageChildContainer = (props: { children: React.ReactNode }) => {
  const [pageEnable, setPageEnable] = React.useState<boolean>(false);
  const [pageRendering, setPageRendering] = React.useState<boolean>(false);

  React.useEffect(() => {
    const task = setTimeout(() => setPageEnable(true), FADEIN_TITLE_DELAY_MS);
    return () => { if (task) clearTimeout(task); }
  }, []);

  React.useEffect(() => {
    const task = pageEnable? setTimeout(() => setPageRendering(true), FADEIN_CHILD_DELAY_MS) : null;
    return () => {
      if (task) clearTimeout(task);
    }
  }, [pageEnable]);

  const opacity = pageRendering? 1 : 0;
  const transition = `${FADEIN_DURATION_MS}ms ease`;
  return pageEnable? (
    <Box sx={{opacity, transition}}>
      {props.children}
    </Box>
    ) : <></>;
}

export default function PageContainer (props: {
  title: string,
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <Box display="flex" justifyContent="center" sx={{width: "100%"}}>
        <Box display="block" sx={{width: "92%"}}>
          <PageTitle title={props.title} />
          <PageChildContainer>
            {props.children}
          </PageChildContainer>
        </Box>
      </Box>
    </>
  );
}
