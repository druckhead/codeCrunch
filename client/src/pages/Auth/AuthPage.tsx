import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";

export default function AuthPage({ isSignInOuter }: authPageProps) {
  const [isSignIn, setIsSignIn] = useState(isSignInOuter);
  const theme = useTheme();

  useEffect(() => {
    setIsSignIn(isSignInOuter);
  }, [isSignInOuter]);

  return (
    <React.Fragment>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          component="h2"
          variant="h5"
          fontWeight={600}
          color="inherit"
          noWrap
          textAlign="center"
        >
          {`Sign ${isSignIn ? "in to your account" : "up for free"}`}
        </Typography>
        <Typography
          component="div"
          color="inherit"
          noWrap
          textAlign="center"
          mb="1em"
        >
          <Box display="flex" justifyContent="center">
            <Box component="div">
              <Typography component="span" color={theme.palette.text.primary}>
                or
              </Typography>
              <Link
                to={isSignIn ? "../sign_up" : "../sign_in"}
                onClick={(e) => {
                  setIsSignIn((prevValue) => !prevValue);
                }}
              >
                <Typography
                  component="span"
                  color="#ffa94c"
                  fontWeight={600}
                  sx={{
                    ":hover": {
                      color: "#ff9832",
                    },
                  }}
                >
                  {" Sign"} {isSignIn ? "up " : "in "}
                  {isSignIn ? "for a new" : "to your existing"} account
                </Typography>
              </Link>
            </Box>
          </Box>
        </Typography>
        {isSignIn ? <Login /> : <Signup />}
      </Box>
    </React.Fragment>
  );
}

export type authPageProps = { isSignInOuter: boolean };
