import { NumericFormat, NumericFormatProps } from "react-number-format";
import { InputAdornment, styled, TextField, TextFieldProps } from "@mui/material";
import { forwardRef, KeyboardEvent } from "react";
import { FieldPath, FieldValues, useController, UseControllerProps, useFormContext } from "react-hook-form";
import { StyledComponent } from "@emotion/styled";

type NumericFieldProps =　Omit<NumericFormatProps<TextFieldProps>, "customInput" | "suffix" | "prefix"> &
    Omit<TextFieldProps, "value" | "onChange" | "type"> & {
      value?: number | string | null,
      onValueChange?: (values: { floatValue: number | undefined }) => void,
      min?: number,
      max?: number,
      suffix?: string | React.ReactElement,
      prefix?: string | React.ReactElement,
  };

type NumericFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<NumericFieldProps, "value" | "onValueChange" | "name" | "label"> & {
  name: TName;
  label?: string;
  rules?: UseControllerProps<FieldValues, TName>["rules"];
  noSubmitOnEnter?: boolean
};

const RightAlignedTextField: StyledComponent<TextFieldProps> = styled(TextField)({
  userSelect: "none",
  "& .MuiInputBase-input": {
    textAlign: "right",
  },
});

export const NumericField = forwardRef<HTMLDivElement, NumericFieldProps>(
 function NumericField (
    {
      value,
      onValueChange,
      thousandSeparator = "",
      decimalScale = undefined,
      fixedDecimalScale = false,
      allowNegative = false,
      prefix = "",
      suffix = "",
      decimalSeparator = ".",
      allowLeadingZeros = false,
      min,
      max,
      slotProps,
      ...textFieldProps
    },
    ref,
  ) {

    const mergedSlotProps = {
      ...slotProps,
      input: {
        ...slotProps?.input,
        ...(prefix && {
          startAdornment: <InputAdornment position="start">{prefix}</InputAdornment>,
        }),
        ...(suffix && {
          endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
        }),
      },
    };

    return (
      <NumericFormat
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        allowNegative={allowNegative}
        allowLeadingZeros={allowLeadingZeros}
        inputRef={ref}
        isAllowed={(values) => {
          if (values.floatValue === undefined) return true;
          if (min !== undefined && values.floatValue <= min) return false;
          if (max !== undefined && values.floatValue >= max) return false;
          return true;
        }}
        value={value}
        onValueChange={onValueChange}
        customInput={RightAlignedTextField}
        slotProps={mergedSlotProps}
        {...textFieldProps}
      />
    );
  },
);


export default function NumericForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  onKeyDown,
  noSubmitOnEnter = true,
  ...rest
}: NumericFormProps<TFieldValues, TName>) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  return (
    <NumericField
      {...field}
      value={field.value ?? ""}
      onValueChange={v => field.onChange(v.floatValue)}
      getInputRef={field.ref}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>): void => {
        if (onKeyDown) onKeyDown(e);
        if (noSubmitOnEnter === true) {
          if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
        }
      }}
      {...rest}
    />
  );
}
