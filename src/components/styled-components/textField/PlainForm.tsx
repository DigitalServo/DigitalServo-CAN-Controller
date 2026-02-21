
import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";


export default React.forwardRef(function F(props: TextFieldProps, ref) {
	return (
		<TextField
			sx={props.sx}
			error={!!props.helperText}
			helperText={props.helperText}
			label={props.label}
			placeholder={props.placeholder}
			inputRef={ref}
			onChange={props.onChange}
			fullWidth
			variant='standard'
			size='small'
			type={props.type}
			slotProps={{
				input: {
				  startAdornment: <InputAdornment position="start" />,
				  inputProps: {
					maxLength: 20,
					autoComplete: "off",
					style: { textAlign: 'left' },
					readOnly: props.disabled,
				  },
				}
			  }}
		/>
	)
});
