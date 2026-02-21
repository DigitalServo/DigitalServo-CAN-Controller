import React from 'react';

import { Box, Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { PlainTextField } from '@/components/styled-components/textField';
import { DialogProps } from '@toolpad/core/useDialogs';

type PayloadType = number;
type ReturnType = { original_recipe_id: number, new_recipe_name: string } | null;

export default function CopyRecipeDialog(props: DialogProps<PayloadType, ReturnType>): React.ReactElement {

  const { open = false, onClose, payload } = props;

  const nameRef = React.useRef<HTMLInputElement>(null);

  const [isFormValid, setIsFormValid] = React.useState(false);
  React.useEffect(() => setIsFormValid(false), [open]);

  const formValidator = () => {
    const isNameValid = nameRef.current?.value.trim() != '';
    setIsFormValid(isNameValid);
  };

  const approvedAction = async () => {

    if (payload == null) return;
    const nameElement: HTMLInputElement | null = nameRef.current;

    if (nameElement == null) return;
    const name = nameElement.value.trim();

    if (name.length == 0) return;

    nameElement.value = '';

    onClose({original_recipe_id: payload, new_recipe_name: name});
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(null)}
        sx={{userSelect: 'none'}}
      >
        <DialogTitle id='CopyRecipeDialog-title'>
          Confirmation
        </DialogTitle>

        <DialogContent sx={{pb: 0}}>
          <DialogContentText id='CopyRecipeDialog-description' sx={{mb: 1}}>
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
            Copy
          </Button>
          <Button sx={{mb: 1}} onClick={() => onClose(null)}>
            Cancel
          </Button>
        </DialogActions>

      </Dialog>

    </>
  );
};
