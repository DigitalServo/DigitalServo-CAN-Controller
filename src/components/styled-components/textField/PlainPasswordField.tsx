import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default React.forwardRef(function F(props: TextFieldProps, ref) {
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
		setShowPassword(true);
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
		setShowPassword(false);
  };

	const preventFormEvent = (event: React.ClipboardEvent<HTMLDivElement>) => {
		event.preventDefault();
	}

	return (
		<TextField
			error={!!props.helperText}
			helperText={props.helperText}
			label={props.label}
			placeholder={props.placeholder}
			inputRef={ref}
			onChange={props.onChange}
			onCopy={preventFormEvent}
			onCut={preventFormEvent}
			onPaste={preventFormEvent}
			fullWidth
			variant='standard'
			size='small'
			type={showPassword? "text" : "password"}
			slotProps={{
				input: {
					startAdornment: <InputAdornment position="start" />,
					inputProps: {
						style: { textAlign: 'left' }
					},
					endAdornment:
						<InputAdornment position="end">
							<IconButton
								onMouseDown={handleMouseDownPassword}
								onMouseUp={handleMouseUpPassword}
								onMouseLeave={handleMouseUpPassword}
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
				}
			}}
		/>
	)
})

export const passwordValidator = (str: string): boolean => {
	const symbol = "!?@#$%^&*()_+\\-=\\]\\[\\{\\}\\|'";
	const regex = new RegExp(
	 `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[${symbol}])[a-zA-Z0-9${symbol}]{8,24}$`
	);

	return regex.test(str);
}
