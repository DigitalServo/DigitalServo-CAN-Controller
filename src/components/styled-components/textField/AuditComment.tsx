
import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

type ExtendTextFieldProps = TextFieldProps & {errorNumber : number}

const AUDIT_COMMENT_MAX_LEN: number = 50;

export const validateAuditComment = (comment: string): number => {
  return (comment.length == 0)? 1 :
  (comment.length > AUDIT_COMMENT_MAX_LEN)? 2 :
  0;
}

export default React.forwardRef(function F(props: ExtendTextFieldProps, ref) {

  const {errorNumber, ...others} = props;

  const [error, setError] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string | null>(null);

  React.useEffect(() => {
    switch (errorNumber) {
      case 1:
        setError(true);
        setErrorText("Please write a comment.");
        break;
      case 2:
        setError(true);
        setErrorText(`Please write a comment within the ${AUDIT_COMMENT_MAX_LEN} word limit.`);
        break;
      default:
        setError(false);
        setErrorText(null);
        break;
    }
  }, [errorNumber]);

	return (
    <TextField
      {...others}
      sx={{minWidth: 400}}
      label="Comment"
      fullWidth
      multiline
      maxRows={4}
      variant="standard"
      inputRef={ref}
      error={error}
      helperText={errorText}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start" />,
        }}
      }
    />
	)
});
