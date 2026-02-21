"use client";

import React from "react";

import { styled, TextField, TextFieldProps } from "@mui/material";
import { useSnackbar } from "notistack";

import { useNodeIdStore } from "@/stores/nodeId";
import { StyledComponent } from "@emotion/styled";

const NODE_ID_MIN: number = 0;
const NODE_ID_MAX: number = 127;

const TinyTextField: StyledComponent<TextFieldProps> = styled(TextField)({
  '& .MuiInputBase-root': {
    height: 28,
    width: 70,
  },
  '& .MuiInputBase-input': {
    padding: '2px 6px',
    fontSize: '0.8rem',     // 12px
  },
  '& .MuiInputLabel-root': {
    '&.MuiInputLabel-shrink': {
      transform: 'translate(12px, -8px) scale(0.75)',
    },
    transform: 'translate(12px, 7px) scale(1)',
    fontSize: '0.75rem',
  },
  '& .MuiOutlinedInput-input': {
    textAlign: 'right',
    paddingRight: 8,
  },
  '& .MuiOutlinedInput-input::placeholder': {
    textAlign: 'left',
    paddingLeft: 4,
    opacity: 0.7,
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    fontSize: '0.7em',
  },
});

export default function NodeIdSelector () {

  const { enqueueSnackbar } = useSnackbar();
  const { nodeId, setNodeId } = useNodeIdStore();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const lastValidValueRef = React.useRef<string>('');

  function parseNodeId (value: string): number | null {
    if (value == "") return null;
    const num = Number(value.replace(/[\uFF10-\uFF19]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)));
    return (!isNaN(num) && num >= NODE_ID_MIN && num <= NODE_ID_MAX)? num : null;
  };

  const handleOnInput = (_event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const input = inputRef.current;
    if (!input) return;

    if (composing) return;

    const currentValue = input.value;

    if (currentValue == "") {
      lastValidValueRef.current = "";
      return;
    }

    const nodeId = parseNodeId(currentValue);
    if (nodeId != null) {
      lastValidValueRef.current = String(nodeId);
      return;
    }

    input.value = lastValidValueRef.current;

    const len = input.value.length;
    input.setSelectionRange(len, len);
  };

  const [composing, setComposition] = React.useState(false);
  const startComposition = () => {
    setComposition(true);
  }
  const endComposition = () => {
    setTimeout(() => setComposition(false), 50);
  }

  const eventHandler = async (event: React.KeyboardEvent) => {

    if (event.key === 'Enter' && !composing) {
      const input: string = (event.target as HTMLInputElement).value;

      if (input.trim().length == 0) {
        setNodeId(null);
        return;
      }

      const newNodeId = parseNodeId(input);
      if (newNodeId == null || nodeId == newNodeId) return;

      setNodeId(Number(newNodeId));
      enqueueSnackbar(`Set Node ID to ${newNodeId}`, { variant: "success" });
    }
  };

  return (
    <>
      <TinyTextField
        sx={{mx: 1}}
        label="Node ID"
        slotProps={{
          input: {
            'aria-label': 'set-node-id',
          },
        }}
        inputRef={inputRef}
        onChange={handleOnInput}
        onKeyDown={eventHandler}
        onCompositionStart={startComposition}
        onCompositionEnd={endComposition}
      />
    </>
  );
}
