import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // send to server
  };

  return (
    <Box p={2}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        border={1}
        p={4}
        borderRadius={3}
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
            />
          ) : (
            <SignupForm
              registerFormValues={registerFormValues}
              setRegisterFormValues={setRegisterFormValues}
            />
          )}
          <Grid item>
            <Button variant="contained" color="success" sx={{ px: 9 }}>
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
};

function SigninForm({ loginFormValues, setLoginFormValues }: signinForm) {
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
        />
      </Grid>
      <Grid item>
        <TextField
          id="password-input"
          name="password"
          label="Password"
          type="password"
          value={loginFormValues.password}
          onChange={(e) => {
            const { name, value } = e.target;
            setLoginFormValues({ ...loginFormValues, [name]: value });
          }}
        />
      </Grid>
    </React.Fragment>
  );
}

type signupForm = {
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

function SignupForm({ registerFormValues, setRegisterFormValues }: signupForm) {
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
        />
      </Grid>
      <Grid item>
        <TextField
          id="password-input"
          name="password"
          label="Password"
          type="password"
          value={registerFormValues.password}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          id="confirm-password-input"
          name="confirm_password"
          label="Confirm Password"
          type="password"
          value={registerFormValues.confirm_password}
          onChange={(e) => {
            const { name, value } = e.target;
            setRegisterFormValues({ ...registerFormValues, [name]: value });
          }}
        />
      </Grid>
    </React.Fragment>
  );
}
