import React from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import BaseForm from "../../../components/forms/BaseForm/BaseForm";
import { SubmitHandler, useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ERoutes } from "../../../utils/endpointConstants";
import { USER_ACTIONS, useUserDispactch } from "../../../context/UserContext";
import ControlledTextField from "../../../components/Inputs/ControlledTextField/ControlledTextField";
import { Box } from "@mui/material";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const dispatch = useUserDispactch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignIn>({
    criteriaMode: "all",
    mode: "all",
    defaultValues: defaultSignin,
  });

  const handleShowPassword = (event: React.MouseEvent) => {
    setShowPassword((preValue) => !preValue);
  };

  const onSubmit: SubmitHandler<SignIn> = (data) => {
    console.log(data);
    const { API_BASE_URL, TOKEN_PREFIX, LOGIN, ME } = ERoutes;

    const LOGIN_URL = `${API_BASE_URL}${TOKEN_PREFIX}${LOGIN}`;
    const ME_URL = `${API_BASE_URL}${TOKEN_PREFIX}${ME}`;

    const onLogin = async () => {
      const response = await axios.post(LOGIN_URL, data);
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
      window.localStorage.setItem("refresh", refresh);
    };
    onLogin();
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
          submitText="Sign in"
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
              required: "Username is required",
            }}
          />
          <ControlledTextField
            name="password"
            id="password-input"
            label="Password"
            type={!showPassword ? "password" : "text"}
            control={control}
            errors={errors}
            rules={{
              required: "Password is required",
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
        </BaseForm>
      </Box>
    </React.Fragment>
  );
};

export default Login;

export interface SignIn {
  username: string;
  password: string;
}

const defaultSignin: SignIn = {
  username: "",
  password: "",
};
