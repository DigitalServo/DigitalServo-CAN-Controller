import React, { useState, useRef, useEffect } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface HoldButtonProps extends Omit<ButtonProps, 'onClick'> {
  holdDuration?: number;
  onHoldComplete?: () => void | Promise<void>;
  children: React.ReactNode;
}

export default function HoldButton({
  holdDuration = 1000,
  onHoldComplete,
  children,
  disabled,
  ...buttonProps
}: HoldButtonProps) {

  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startHolding = () => {
    if (disabled || isHolding) return;
    setIsHolding(true);
    setProgress(0);

    let start: number | null = null;

    const update = (timestamp: number) => {
      if (!start) start = timestamp;

      const elapsed = timestamp - start;
      const newProgress = Math.min(100, (elapsed / holdDuration) * 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(update);
      } else {
        setIsHolding(false);
        onHoldComplete?.();
      }
    };

    animationFrameRef.current = requestAnimationFrame(update);
  };

  const stopHolding = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <Button
        {...buttonProps}
        disabled={disabled}
        onMouseDown={startHolding}
        onMouseUp={stopHolding}
        onMouseLeave={stopHolding}
        onTouchStart={startHolding}
        onTouchEnd={stopHolding}
        // disableFocusRipple
        // disableRipple
        sx={{
          pr: 0,
          ...buttonProps.sx,
          ...(isHolding && {
            transform: 'scale(0.97)',
            transition: 'transform 0.12s',
          }),
        }}
      >
        {children}

        <CircularProgress
          variant="determinate"
          value={progress}
          size={buttonProps.size == "small" ? 16 : buttonProps.size == "medium" ? 18 : 20}
          thickness={5}
          sx={{
            mx: 1,
            pointerEvents: 'none',
            color: buttonProps.variant == "contained"? "#fff" : "primary",
            '& .MuiCircularProgress-circle': {
              transition: 'none',
            },
          }}
        />

      </Button>
    </Box>
  );
}
