import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormSetValue,
} from "react-hook-form";
import AutoCompleteField, {
  TFieldName,
} from "../../AutoCompleteField/AutoCompleteField";
import { PostForm } from "../../PostEditor/PostEditor";
import { ErrorMessage } from "@hookform/error-message";
import { Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { Country } from "../../../data/countriesList";

const ControlledAutoComplete = (props: ControlledAutoCompleteFieldProps) => {
  const {
    name,
    control,
    setOptions,
    setValue,
    fieldId,
    freeSolo,
    label,
    fieldName,
    fieldOptions,
    errors,
    rules,
    helperText,
  } = props;

  return (
    <React.Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <AutoCompleteField
            field={field}
            errors={errors}
            setValue={setValue}
            freeSolo={freeSolo ? freeSolo : false}
            setOptions={setOptions}
            fieldOptions={fieldOptions}
            fieldId={fieldId}
            fieldName={fieldName}
            label={label}
            helperText={helperText}
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

export default ControlledAutoComplete;

export interface ControlledAutoCompleteFieldProps {
  name: string;
  control: Control<any, any>;
  errors: FieldErrors<FieldValues>;
  label: string;
  freeSolo?: boolean;
  // prettier-ignore
  rules?:  Omit<RegisterOptions<FieldValues, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined
  fieldOptions: readonly string[] | readonly Country[];
  fieldId: string;
  fieldName: TFieldName;
  helperText?: string;
  setValue: UseFormSetValue<PostForm>;
  setOptions?: React.Dispatch<React.SetStateAction<readonly string[]>>;
}
