import React from 'react';

import { Box, Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { PlainTextField } from '@/components/styled-components/textField';
import { DialogProps } from '@toolpad/core/useDialogs';

type PayloadType = null;
type ReturnType = string | null;

export default function CreateRecipeDialog (props: DialogProps<PayloadType, ReturnType>): React.ReactElement {

	const { open = false, onClose } = props;

  const nameRef = React.useRef<HTMLInputElement>(null);

  const [isFormValid, setIsFormValid] = React.useState(false);
  React.useEffect(() => setIsFormValid(false), [open]);

  const formValidator = () => {
    const isNameValid = nameRef.current?.value.trim() != '';
    setIsFormValid(isNameValid);
  };

  const approvedAction = async () => {
    const nameElement: HTMLInputElement | null = nameRef.current;
    if (nameElement == null) return;

    const name = nameElement.value.trim();
    if (name.length == 0) return;

    nameElement.value = '';

    onClose(name);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(null)}
        sx={{userSelect: 'none'}}
      >
        <DialogTitle id='CreateRecipeDialog-title'>
          Confirmation
        </DialogTitle>

        <DialogContent sx={{pb: 0}}>
          <DialogContentText id='CreateRecipeDialog-description' sx={{mb: 1}}>
            Please enter a new recipe name.
          </DialogContentText>
        </DialogContent>

        <Box display='flex' justifyContent='center' sx={{mt: 2, mx: 3}}>
          <PlainTextField
            label={'Recipe Name'}
            placeholder={''}
            ref={nameRef}
            onChange={formValidator}
          />
        </Box>

        <DialogActions sx={{mr: 2}}>
          <Button sx={{mb: 1}} onClick={_ => approvedAction()} autoFocus disabled={!isFormValid}>
            Create
          </Button>
          <Button sx={{mb: 1}} onClick={() => onClose(null)}>
            Cancel
          </Button>
        </DialogActions>

      </Dialog>

    </>
  );
};
