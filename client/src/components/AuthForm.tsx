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
import React, { useState } from "react";
import {
  USER_ACTIONS,
  useUser,
  useUserDispactch,
} from "../context/UserContext";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/endpointConstants";
import { useLocalStorage } from "usehooks-ts";

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

export default function AuthForm({ isSignIn }: { isSignIn: boolean }) {
  const [refreshToken, setRefreshToken] = useLocalStorage("refresh", null);

  const [showPassword, setShowPassword] = useState(false);
  const [loginFormValues, setLoginFormValues] = useState<defaultSigninValues>({
    username: "",
    password: "",
  });
  const [registerFormValues, setRegisterFormValues] =
    useState<defaultSignupValues>({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });
  const user = useUser();
  const userDispatch = useUserDispactch();

  const handleShowPassword = (event: React.MouseEvent) => {
    setShowPassword((preValue) => !preValue);
  };

  const handleSubmit = (
    event: React.FormEvent,
    type: "sign_in" | "sign_up"
  ) => {
    event.preventDefault();
    if (type === "sign_in") {
      const getLoginTokens = async () => {
        const response = await axios.post(
          API_ENDPOINTS.AUTH.LOGIN,
          loginFormValues
        );
        userDispatch({
          type: USER_ACTIONS.LOGIN,
          payload: {
            accessToken: response.data.access,
            refreshToken: response.data.refresh,
          },
        });
        setRefreshToken(response.data.refresh);
      };
      getLoginTokens();
    } else {
      console.log(registerFormValues);
      // TODO SEND REGISTER TO SERVER
    }
  };

  return (
    <Box p={2} display="grid" sx={{ placeItems: "center" }}>
      <Box
        component="form"
        onSubmit={(event) =>
          handleSubmit(event, isSignIn ? "sign_in" : "sign_up")
        }
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
              loginFormValues={loginFormValues}
              setLoginFormValues={setLoginFormValues}
              showPassword={showPassword}
              showPasswordHandler={handleShowPassword}
            />
          ) : (
            <SignupForm
              registerFormValues={registerFormValues}
              setRegisterFormValues={setRegisterFormValues}
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

type signinForm = {
  loginFormValues: defaultSigninValues;
  setLoginFormValues: React.Dispatch<React.SetStateAction<defaultSigninValues>>;
  showPassword: boolean;
  showPasswordHandler: React.MouseEventHandler;
};

function SigninForm({
  loginFormValues,
  setLoginFormValues,
  showPassword,
  showPasswordHandler,
}: signinForm) {
  return (
    <React.Fragment>
      <Grid item>
        <TextField
          id="username-input"
          name="username"
          label="Username"
          type="text"
          value={loginFormValues.username}
          onChange={(e) => {
            const { name, value } = e.target;
            setLoginFormValues({ ...loginFormValues, [name]: value });
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
        />
      </Grid>
      <Grid item>
        <TextField
          id="password-input"
          name="password"
          label="Password"
          type={!showPassword ? "password" : "text"}
          value={loginFormValues.password}
          onChange={(e) => {
            const { name, value } = e.target;
            setLoginFormValues({ ...loginFormValues, [name]: value });
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPasswordHandler}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
        />
      </Grid>
    </React.Fragment>
  );
}

type signupForm = {
  showPassword: boolean;
  showPasswordHandler: React.MouseEventHandler;
  registerFormValues: defaultSignupValues;
  setRegisterFormValues: React.Dispatch<
    React.SetStateAction<{
      first_name: string;
      last_name: string;
      username: string;
      email: string;
      password: string;
      confirm_password: string;
    }>
  >;
};

function SignupForm({
  registerFormValues,
  setRegisterFormValues,
  showPassword,
  showPasswordHandler,
}: signupForm) {
  return (
    <React.Fragment>
      <Grid item>
        <TextField
          id="username-input"
          name="username"
          label="Username"
          type="text"
          value={registerFormValues.username}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
        />
      </Grid>
      <Grid item>
        <TextField
          id="email-input"
          name="email"
          label="Email"
          type="text"
          value={registerFormValues.email}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
        />
      </Grid>
      <Grid item>
        <TextField
          id="first-name-input"
          name="first_name"
          label="First Name"
          type="text"
          value={registerFormValues.first_name}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
        />
      </Grid>
      <Grid item>
        <TextField
          id="last-name-input"
          name="last_name"
          label="Last Name"
          type="text"
          value={registerFormValues.last_name}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
        />
      </Grid>
      <Grid item>
        <TextField
          id="password-input"
          name="password"
          label="Password"
          type={!showPassword ? "password" : "text"}
          value={registerFormValues.password}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPasswordHandler}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          id="confirm-password-input"
          name="confirm_password"
          label="Confirm Password"
          type={!showPassword ? "password" : "text"}
          value={registerFormValues.confirm_password}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
          sx={{ width: { xs: 200, sm: 248 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPasswordHandler}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </React.Fragment>
  );
}
