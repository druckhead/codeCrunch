import React from "react";
import axios from "axios";
import { SignIn } from "../Login/Login";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import BaseForm from "../../components/forms/BaseForm/BaseForm";
import { SubmitHandler, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { USER_ACTIONS, useUserDispactch } from "../../context/UserContext";
import { ERoutes } from "../../utils/endpointConstants";
import ControlledTextField from "../../components/Inputs/ControlledTextField/ControlledTextField";
import { Box } from "@mui/material";

const Signup = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const dispatch = useUserDispactch();

  const {
    control,
    trigger,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Signup>({
    criteriaMode: "all",
    mode: "all",
    defaultValues: defaultSignup,
  });

  const handleShowPassword = (event: React.MouseEvent) => {
    setShowPassword((preValue) => !preValue);
  };

  const handleShowConfirmPassword = (event: React.MouseEvent) => {
    setShowConfirmPassword((prevValue) => !prevValue);
  };

  const onSubmit: SubmitHandler<Signup> = (data) => {
    console.log(data);
    const { API_BASE_URL, V1, TOKEN_PREFIX, USERS_PREFIX, ME } = ERoutes;

    const REGISTER_URL = `${API_BASE_URL}${V1}${USERS_PREFIX}`;
    const ME_URL = `${API_BASE_URL}${TOKEN_PREFIX}${ME}`;

    const register = async () => {
      const response = await axios.post(REGISTER_URL, data);
      const { access, refresh } = response.data;

      const config = {
        headers: { Authorization: `Bearer ${access}` },
      };
      const userResponse = await axios.get(ME_URL, config);
      dispatch({
        type: USER_ACTIONS.LOGIN,
        payload: {
          accessToken: access,
          refreshToken: refresh,
        },
      });
      dispatch({ type: USER_ACTIONS.ME, payload: userResponse.data });
    };
    register();
  };

  return (
    <React.Fragment>
      <Box
        display="flex"
        justifyContent="center"
        border={1}
        borderRadius={3}
        p={2}
        width={"80%"}
      >
        <BaseForm
          submitText="Sign up"
          buttonColor="success"
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        >
          <ControlledTextField
            name="username"
            id="username-input"
            label="Username"
            type="text"
            control={control}
            errors={errors}
            rules={{
              required: "Password is required",
            }}
          />
          <ControlledTextField
            name="email"
            id="email-input"
            label="Email"
            type="text"
            control={control}
            errors={errors}
            rules={{
              required: "Email is required",
              pattern: {
                // prettier-ignore
                value: /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
                message: "unvalid email address",
              },
            }}
          />
          <ControlledTextField
            name="first_name"
            id="first-name-input"
            label="First Name"
            type="text"
            control={control}
            errors={errors}
          />
          <ControlledTextField
            name="last_name"
            id="last-name-input"
            label="Last Name"
            type="text"
            control={control}
            errors={errors}
          />
          <ControlledTextField
            name="password"
            id="password-input"
            label="Password"
            type={!showPassword ? "password" : "text"}
            control={control}
            errors={errors}
            onChange={(event) => {
              getValues("confirm_password").length > 0 &&
                trigger("confirm_password");
            }}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "8 character minimum",
              },
              validate: {
                hasDigit: (value) => /[\d]/.test(value) || "1 digit",
                hasLower: (value) =>
                  /[a-z]/.test(value) || "1 lower case letter",
                hasUpper: (value) =>
                  /[A-Z]/.test(value) || "1 upper case letter",
                specialChar: (value) =>
                  /[#?!@$%^&*-]/.test(value) || "1 special character",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <ControlledTextField
            name="confirm_password"
            id="confirm-password-input"
            label="Confirm Password"
            type={!showConfirmPassword ? "password" : "text"}
            control={control}
            errors={errors}
            rules={{
              required: "Confirm Password is required",
              validate: {
                matchPassword: (value, event) =>
                  value === event.password || "passwords must match",
                matchPassword2: (value, event) =>
                  value === event.confirm_password || "passwords must match",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowConfirmPassword}>
                    {showConfirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </BaseForm>
      </Box>
    </React.Fragment>
  );
};

export default Signup;

interface Signup extends SignIn {
  email: string;
  first_name: string;
  last_name: string;
  confirm_password: string;
}

const defaultSignup: Signup = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  confirm_password: "",
};
