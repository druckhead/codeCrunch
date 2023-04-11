import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { Link, useLocation } from "react-router-dom";

export default function AuthPage() {
  const location = useLocation();
  const pathName = location.pathname;
  const isSignInDefault = pathName === "/sign_in";
  const [isSignIn, setIsSignIn] = useState(isSignInDefault);
  const theme = useTheme();

  return (
    <Box pt={5}>
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
      <Typography component="div" color="inherit" noWrap textAlign="center">
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
      <AuthForm isSignIn={isSignIn} />
    </Box>
  );
}
