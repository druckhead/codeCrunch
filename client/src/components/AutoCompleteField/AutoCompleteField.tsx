import {
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormSetValue,
} from "react-hook-form";
import { PostForm } from "../PostEditor/PostEditor";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { ERoutes } from "../../utils/endpointConstants";
import { getField } from "../../utils/postGetters";
import { Country } from "../../data/countriesList";
import { Seniority } from "../../data/seniorityList";

const AutoCompleteField = (props: AutoCompleteFieldProps) => {
  const {
    field,
    setValue,
    fieldOptions,
    fieldId,
    label,
    errors,
    fieldName,
    freeSolo,
    helperText,
    setOptions,
  } = props;

  return (
    <Autocomplete
      value={field.value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          const cleanNewVal = newValue.includes("Add")
            ? newValue.replace("Add ", "")
            : newValue;
          setValue(fieldName, cleanNewVal);
        } else if (instanceOfCountry(newValue) && newValue && newValue.code) {
          setValue(fieldName, newValue.code);
        }
      }}
      onOpen={async (event) => {
        if (setOptions) {
          const { COMPANIES_PREFIX, JOBS_PREFIX } = ERoutes;

          let prefix;

          switch (field.name) {
            case "company":
              prefix = COMPANIES_PREFIX;
              break;
            case "job":
              prefix = JOBS_PREFIX;
              break;
            default:
              return;
          }

          const optionsList = await getField(prefix);
          setOptions(optionsList);
        }
      }}
      id={fieldId}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option);
        if (inputValue !== "" && !isExisting && freeSolo) {
          filtered.push(`Add ${inputValue}`);
        }
        return filtered;
      }}
      isOptionEqualToValue={(option, value) => {
        if (!freeSolo && !value) return true;

        if (instanceOfCountry(option)) {
          return option.code === value;
        }

        return option === value;
      }}
      selectOnFocus
      clearOnBlur
      autoHighlight
      handleHomeEndKeys
      options={fieldOptions}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          if (option.includes("Add")) {
            return option.replace("Add ", "");
          }
          return option;
        } else {
          return option.name;
        }
      }}
      renderOption={(props, option) => {
        if (typeof option === "string") {
          if (option.includes("Add")) {
            return <li {...props}>{option}</li>;
          }
          const cleanOption = option.replace("Add ", "");
          return <li {...props}>{cleanOption}</li>;
        } else {
          return <li {...props}>{option.name}</li>;
        }
      }}
      freeSolo={freeSolo}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label}
          aria-invalid={errors[`${field.name}`] ? "true" : "false"}
          error={!!errors[`${field.name}`]}
          helperText={helperText}
        />
      )}
    />
  );
};

export default AutoCompleteField;

export type TFormField =
  | ControllerRenderProps<PostForm, "post_type">
  | ControllerRenderProps<PostForm, "language">
  | ControllerRenderProps<PostForm, "company">
  | ControllerRenderProps<PostForm, "seniority">
  | ControllerRenderProps<PostForm, "country">
  | ControllerRenderProps<PostForm, "job">;

export type TFieldName =
  | "post_type"
  | "language"
  | "company"
  | "seniority"
  | "country"
  | "job"
  | "years_experience"
  | "content";

export interface AutoCompleteFieldProps {
  field: ControllerRenderProps<any, string>;
  setValue: UseFormSetValue<any>;
  setOptions?: React.Dispatch<React.SetStateAction<readonly string[]>>;
  fieldOptions: readonly string[] | readonly Country[];
  label: string;
  fieldId: string;
  fieldName: TFieldName;
  helperText?: string;
  errors: FieldErrors<FieldValues>;
  freeSolo?: boolean;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
      >
    | undefined;
}

const filter = createFilterOptions<string>();

function instanceOfCountry(object: any): object is Country {
  if (typeof object === "object") return "code" in object && "name" in object;
  return false;
}
