"use client";

import React from "react";
import { Box, ClickAwayListener, Tooltip, TooltipProps } from "@mui/material";

export function ClickableTooltip(props: TooltipProps) {

  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipToggle = () => {
    setOpen(state => !state);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        {...props}
        placement="right"
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        slotProps={{
          popper: {
            disablePortal: true,
          },
        }}>
          <Box onClick={ handleTooltipToggle}>
            {props.children}
          </Box>
      </Tooltip>
    </ClickAwayListener>
  )
}
