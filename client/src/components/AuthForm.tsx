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
    if (isSignIn) {
      reset(defaultLogin);
    } else {
      reset(defaultSignup);
    }
  }, [isSignIn]);

  const handleShowPassword = (event: React.MouseEvent) => {
    setShowPassword((preValue) => !preValue);
  };

  const onSubmit: SubmitHandler<defaultSigninValues | defaultSignupValues> = (
    data
  ) => {
    // isSignIn ? reset(defaultLogin) : reset(defaultSignup);
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
        sx={{
          width: { xs: "100%", sm: "50%" },
          "& .MuiFormHelperText-root::before": {
            content: '"⚠ "',
          },
        }}
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

type signInType = {
  control: Control<defaultSigninValues, any>;
  errors: FieldErrors<defaultSigninValues>;
  showPassword: boolean;
  showPasswordHandler: React.MouseEventHandler;
};

type signUpType = {
  control: Control<defaultSignupValues | defaultSigninValues, any>;
  errors: FieldErrors<defaultSignupValues>;
  showPassword: boolean;
  showPasswordHandler: React.MouseEventHandler;
};

function SigninForm({
  control,
  errors,
  showPassword,
  showPasswordHandler,
}: signInType) {
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
              value={field.value || ""}
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
              value={field.value || ""}
              type={!showPassword ? "password" : "text"}
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
              aria-invalid={errors.password ? "true" : "false"}
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
}: signUpType) {
  return (
    <React.Fragment>
      <Grid item>
        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required" }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="username-input"
              label="Username"
              type="text"
              value={field.value || ""}
              aria-invalid={errors.username ? "true" : "false"}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
      </Grid>
      <Grid item>
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="email-input"
              label="Email"
              type="text"
              value={field.value || ""}
              aria-invalid={errors.email ? "true" : "false"}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
      </Grid>
      <Grid item>
        <Controller
          name="first_name"
          control={control}
          rules={{ required: "First name is required" }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="first-name-input"
              label="First Name"
              type="text"
              value={field.value || ""}
              aria-invalid={errors.first_name ? "true" : "false"}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
      </Grid>
      <Grid item>
        <Controller
          name="last_name"
          control={control}
          rules={{ required: "Last name is required" }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="last-name-input"
              label="Last Name"
              type="text"
              value={field.value || ""}
              aria-invalid={errors.last_name ? "true" : "false"}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
      </Grid>
      <Grid item>
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="password-input"
              label="Password"
              type={!showPassword ? "password" : "text"}
              value={field.value || ""}
              sx={{ width: { xs: 200, sm: 248 } }}
              aria-invalid={errors.password ? "true" : "false"}
              error={!!errors.password}
              helperText={errors.password?.message}
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
        />
      </Grid>
      <Grid item>
        <Controller
          name="confirm_password"
          control={control}
          rules={{ required: "Confirm Password is required" }}
          render={({ field: { ref, ...field } }) => (
            <TextField
              {...field}
              inputRef={ref}
              id="confirm-password-input"
              label="Confirm Password"
              type={!showPassword ? "password" : "text"}
              value={field.value || ""}
              aria-invalid={errors.confirm_password ? "true" : "false"}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
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
        />
      </Grid>
    </React.Fragment>
  );
}
