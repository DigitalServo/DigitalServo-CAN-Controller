"use client"

import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

export enum FormType {
  Unknown = 0,
  Decimal = 1,
  Float = 2,
};

const INPUT_REPLACE_DECIMAL: RegExp = /([^\d\-])/g;
const INPUT_REPLACE_FLOAT: RegExp = /([^\d\.\-])/g;

const INPUT_PATTERN_DECIMAL: string = "^[+-]?\\d+$";
const INPUT_PATTERN_FLOAT: string = "^[+-]?\\d+(?:\.\\d+)?$";

type ParameterFiledProps = TextFieldProps & {
  unit?: string | React.ReactElement | null,
  formType: FormType,
  min?: number,
  max?: number,
}

export default React.forwardRef(function F(props: ParameterFiledProps, ref: React.ForwardedRef<HTMLInputElement>) {

  const { unit, formType, min, max, ...textFieldProps} = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputError, setInputError] = React.useState<boolean>(false);

  const [inputReplaceTarget, setInputReplaceTarget] = React.useState<RegExp | null>(null);
  const [inputPattern, setInputPattern] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {

    const _inputReplaceTarget =
      formType == FormType.Decimal? INPUT_REPLACE_DECIMAL :
      formType == FormType.Float? INPUT_REPLACE_FLOAT :
      null;

    const _inputPattern =
      formType == FormType.Decimal? INPUT_PATTERN_DECIMAL :
      formType == FormType.Float? INPUT_PATTERN_FLOAT :
      undefined;

    setInputReplaceTarget(_inputReplaceTarget);
    setInputPattern(_inputPattern);

  }, [formType]);

  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {

    if (inputReplaceTarget == null) return;

    if (props.onChange) props.onChange(event);

    event.target.value = event.target.value.replace(inputReplaceTarget, "").replace("\.\.", "\.").replace("--", "-");

    if (event.target.value.trim().length == 0) return;

    const value = Number(event.target.value)

    if (!Number.isNaN(value)) {
      if (max != null && value > max) event.target.value = String(max);
      if (min != null && value < min) event.target.value = String(min);
    }

    if (inputRef.current) {
      setInputError(!inputRef.current.validity.valid);
    }
  };

  return (
    <TextField
      {...textFieldProps}
      inputRef={inputRef}
      error={inputError}
      onChange={onInputChange}
      size='small'
      slotProps={{
        htmlInput: {
          sx: { textAlign: 'right' },
          pattern: inputPattern,
          ...props.slotProps?.htmlInput
        },
        input: {
          startAdornment: <InputAdornment position="start" />,
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{alignSelf: 'flex-end', mb: 1.0, ml: 1.0, pointerEvents: 'none' }}
            >
              { unit }
            </InputAdornment>
          ),
        },
      }}
    />
  )
});
