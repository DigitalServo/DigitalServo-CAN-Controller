import React from 'react';

import { Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DialogProps } from '@toolpad/core/useDialogs';

type PayloadType = null;
type ReturnType = boolean | null;

export default function RemoveRecipeDialog (props: DialogProps<PayloadType, ReturnType>): React.ReactElement {

	const { open = false, onClose } = props;

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(null)}
        sx={{userSelect: 'none'}}
      >
        <DialogTitle id='RemoveRecipeDialog-title'>
          Confirmation
        </DialogTitle>

        <DialogContent sx={{pb: 0}}>
          <DialogContentText id='RemoveRecipeDialog-description' sx={{mb: 1}}>
            Are you sure you want to remove the recipe?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{mr: 2}}>
          <Button sx={{mb: 1}} onClick={_ => onClose(true)} autoFocus>
            Remove
          </Button>
          <Button sx={{mb: 1}} onClick={() => onClose(null)}>
            Cancel
          </Button>
        </DialogActions>

      </Dialog>

    </>
  );
};
