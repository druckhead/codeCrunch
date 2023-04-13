import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useEffect, useState } from "react";
import {
  USER_ACTIONS,
  useUser,
  useUserDispactch,
} from "../context/UserContext";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/endpointConstants";
import { useLocalStorage } from "usehooks-ts";
import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";

interface defaultSignupValues {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface defaultSigninValues {
  username: string;
  password: string;
}

type AuthFormProps = {
  isSignIn: boolean;
};

const defaultLogin: defaultSigninValues = {
  username: "",
  password: "",
};

const defaultSignup: defaultSignupValues = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function AuthForm({ isSignIn }: AuthFormProps) {
  const {
    control,
    formState,
    reset,
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm<defaultSigninValues | defaultSignupValues>({
    defaultValues: isSignIn ? defaultLogin : defaultSignup,
  });
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh", null);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const userDispatch = useUserDispactch();

  useEffect(() => {
    isSignIn ? reset(defaultLogin) : reset(defaultSignup);
  }, [isSignIn]);

  const handleShowPassword = (event: React.MouseEvent) => {
    setShowPassword((preValue) => !preValue);
  };

  const onSubmit: SubmitHandler<defaultSigninValues | defaultSignupValues> = (
    data
  ) => {
    console.log(data);

    // event.preventDefault();
    // if (location.pathname === "/sign_in") {
    //   const getLoginTokens = async () => {
    //     const response = await axios.post(
    //       API_ENDPOINTS.AUTH.LOGIN,
    //       loginFormValues
    //     );
    //     const config = {
    //       headers: { Authorization: `Bearer ${response.data.access}` },
    //     };
    //     const userResponse = await axios.get(API_ENDPOINTS.AUTH.ME, config);
    //     userDispatch({
    //       type: USER_ACTIONS.LOGIN,
    //       payload: {
    //         accessToken: response.data.access,
    //         refreshToken: response.data.refresh,
    //       },
    //     });
    //     userDispatch({ type: USER_ACTIONS.ME, payload: userResponse.data });
    //     setRefreshToken(response.data.refresh);
    //   };
    //   getLoginTokens();
    // } else {
    //   console.log(registerFormValues);
    //   const register = async () => {
    //     const response = await axios.post(
    //       API_ENDPOINTS.USERS.REGISTER,
    //       registerFormValues
    //     );
    //     const config = {
    //       headers: { Authorization: `Bearer ${response.data.access}` },
    //     };
    //     const userResponse = await axios.get(API_ENDPOINTS.AUTH.ME, config);
    //     userDispatch({
    //       type: USER_ACTIONS.LOGIN,
    //       payload: {
    //         accessToken: response.data.access,
    //         refreshToken: response.data.refresh,
    //       },
    //     });
    //     userDispatch({ type: USER_ACTIONS.ME, payload: userResponse.data });
    //   };
    //   register();
    // }
  };

  return (
    <Box p={2} display="grid" sx={{ placeItems: "center" }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        border={1}
        py={4}
        borderRadius={3}
        sx={{ width: { xs: "100%", sm: "50%" } }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
          gap={2}
        >
          {isSignIn ? (
            <SigninForm
              control={control}
              errors={errors}
              showPassword={showPassword}
              showPasswordHandler={handleShowPassword}
            />
          ) : (
            <SignupForm
              control={control}
              errors={errors}
              showPassword={showPassword}
              showPasswordHandler={handleShowPassword}
            />
          )}
          <Grid item>
            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{ width: { xs: 200, sm: 248 } }}
            >
              Sign {isSignIn ? "in" : "up"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

type formType = {
  control: Control<defaultSigninValues | defaultSignupValues, any>;
  errors: FieldErrors<defaultSigninValues | defaultSignupValues>;
  showPassword: boolean;
  showPasswordHandler: React.MouseEventHandler;
};

function SigninForm({
  control,
  errors,
  showPassword,
  showPasswordHandler,
}: formType) {
  return (
    <React.Fragment>
      <Grid item>
        <Controller
          name="username"
          control={control}
          rules={{
            required: "Username is required",
          }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="username-input"
              label="Username"
              type="text"
              aria-invalid={errors.password ? "true" : "false"}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
      </Grid>
      <Grid item>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="password-input"
              label="Password"
              type={!showPassword ? "password" : "text"}
              aria-invalid={errors.password ? "true" : "false"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPasswordHandler}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
      </Grid>
    </React.Fragment>
  );
}

function SignupForm({
  control,
  errors,
  showPassword,
  showPasswordHandler,
}: formType) {
  return (
    <React.Fragment>
      <Grid item>
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="username-input"
              label="Username"
              type="text"
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
          name="username"
          control={control}
        />
      </Grid>
      <Grid item>
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="email-input"
              label="Email"
              type="text"
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
          name="email"
          control={control}
        />
      </Grid>
      <Grid item>
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="first-name-input"
              label="First Name"
              type="text"
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
          name="first_name"
          control={control}
        />
      </Grid>
      <Grid item>
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="last-name-input"
              label="Last Name"
              type="text"
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
          name="last_name"
          control={control}
        />
      </Grid>
      <Grid item>
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="password-input"
              label="Password"
              type={!showPassword ? "password" : "text"}
              sx={{ width: { xs: 200, sm: 248 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPasswordHandler}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          name="password"
          control={control}
        />
      </Grid>
      <Grid item>
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              id="confirm-password-input"
              label="Confirm Password"
              type={!showPassword ? "password" : "text"}
              sx={{ width: { xs: 200, sm: 248 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPasswordHandler}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          name="confirm_password"
          control={control}
        />
      </Grid>
    </React.Fragment>
  );
}
