import React, { PropsWithChildren } from "react";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ErrorIcon from "@mui/icons-material/Error";
import { ErrorMessage } from "@hookform/error-message";
import {
  OutlinedInputProps,
  FilledInputProps,
  InputBaseComponentProps,
} from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormGetValues,
  UseFormTrigger,
} from "react-hook-form";

const ControlledTextField = (props: InputTextFieldProps) => {
  const { name, control, errors, rules, id, label, type, inputProps } = props;
  const { helperText } = props;
  const { onChange } = props;

  return (
    <React.Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { ref, ...field } }) => (
          <TextField
            variant="standard"
            fullWidth
            {...field}
            inputRef={ref}
            id={id}
            label={label}
            type={type}
            value={field.value || ""}
            onChange={
              !onChange
                ? field.onChange
                : (event) => {
                    field.onChange(event);
                    onChange(event);
                  }
            }
            helperText={helperText}
            aria-invalid={errors[`${name}`] ? "true" : "false"}
            error={!!errors[`${name}`]}
            inputProps={inputProps}
          />
        )}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => (
            <Typography
              component="div"
              display="flex"
              className="FormErrorText-root"
              color="error"
              key={type}
              mt={1}
              sx={{ width: { xs: 200, sm: 248 } }}
            >
              <Typography component="span" fontSize="1.2em" mr={1}>
                <ErrorIcon fontSize="inherit" />
              </Typography>
              {message}
            </Typography>
          ))
        }
      />
    </React.Fragment>
  );
};

export default ControlledTextField;

export interface InputFieldProps {
  name: string;
  control: Control<any, any>;
  errors: FieldErrors<FieldValues>;
  id: string;
  label: string;
  // prettier-ignore
  rules?:  Omit<RegisterOptions<FieldValues, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined
}

export interface InputTextFieldProps extends InputFieldProps {
  inputProps?: InputBaseComponentProps | undefined;
  type?: React.InputHTMLAttributes<unknown>["type"];
  getValues?: UseFormGetValues<FieldValues>;
  trigger?: UseFormTrigger<FieldValues>;
  // prettier-ignore
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  helperText?: string;
}
