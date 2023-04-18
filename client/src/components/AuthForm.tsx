import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
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
  UseFormGetValues,
  UseFormSetError,
  UseFormTrigger,
  useForm,
} from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import ErrorIcon from "@mui/icons-material/Error";

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
    getValues,
    reset,
    trigger,
    setError,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = useForm<defaultSigninValues | defaultSignupValues>({
    values: isSignIn ? defaultLogin : defaultSignup,
    criteriaMode: "all",
    mode: "all",
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

  console.log(errors);

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
          "& .FormErrorText-root, .FormErrorText-root::before": {
            fontSize: "0.75rem",
            fontWeight: 600,
          },
          "& .FormErrorText-root": {
            pl: "14px",
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
              trigger={trigger}
              getValues={getValues}
              setError={setError}
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
  control: Control<defaultSigninValues | defaultSignupValues, any>;
  errors: FieldErrors<defaultSignupValues>;
  setError: UseFormSetError<defaultSignupValues>;
  trigger: UseFormTrigger<defaultSigninValues | defaultSignupValues>;
  getValues: UseFormGetValues<defaultSigninValues | defaultSignupValues>;
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
              // helperText={errors.username?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="username"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  component="div"
                  display="flex"
                  className="FormErrorText-root"
                  color="error"
                  key={type}
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
        </Grid>
      </Grid>
      <Grid item>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
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
              // helperText={errors.password?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  key={type}
                  className="FormErrorText-root"
                  color="error"
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
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function SignupForm({
  control,
  errors,
  trigger,
  getValues,
  showPassword,
  showPasswordHandler,
}: signUpType) {
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
              aria-invalid={errors.username ? "true" : "false"}
              error={!!errors.username}
              // helperText={errors.username?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="username"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  key={type}
                  className="FormErrorText-root"
                  color="error"
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
        </Grid>
      </Grid>
      <Grid item>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
              message: "unvalid email address",
            },
          }}
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
              // helperText={errors.email?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  key={type}
                  className="FormErrorText-root"
                  color="error"
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
        </Grid>
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
              // helperText={errors.first_name?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="first_name"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  key={type}
                  className="FormErrorText-root"
                  color="error"
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
        </Grid>
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
              // helperText={errors.last_name?.message}
              sx={{ width: { xs: 200, sm: 248 } }}
            />
          )}
        />
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="last_name"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  key={type}
                  className="FormErrorText-root"
                  color="error"
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
        </Grid>
      </Grid>
      <Grid item>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "8 character minimum",
            },
            validate: {
              hasDigit: (value) => /[\d]/.test(value) || "1 digit",
              hasLower: (value) => /[a-z]/.test(value) || "1 lower case letter",
              hasUpper: (value) => /[A-Z]/.test(value) || "1 upper case letter",
              specialChar: (value) =>
                /[#?!@$%^&*-]/.test(value) || "1 special character",
            },
          }}
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
              // helperText={errors.password?.message}
              onChange={(event) => {
                field.onChange(event);
                {
                  getValues("confirm_password").length > 0 &&
                    trigger("confirm_password");
                }
              }}
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
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  component="div"
                  key={type}
                  className="FormErrorText-root"
                  color="error"
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
        </Grid>
      </Grid>
      <Grid item>
        <Controller
          name="confirm_password"
          control={control}
          rules={{
            required: "Confirm Password is required",
            validate: {
              matchPassword: (value, event) =>
                value === event.password || "passwords must match",
              matchPassword2: (value, event) => {
                if (isSignUpType(event)) {
                  return (
                    value === event.confirm_password || "passwords must match"
                  );
                }
                return true;
              },
            },
          }}
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
              // helperText={errors.confirm_password?.message}
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
        <Grid item sx={{ mt: 1 }}>
          <ErrorMessage
            errors={errors}
            name="confirm_password"
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <Typography
                  key={type}
                  className="FormErrorText-root"
                  color="error"
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
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function isSignUpType(object: any): object is defaultSignupValues {
  return "confirm_password" in object;
}
