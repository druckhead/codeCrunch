import { Box, Container, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(false);
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
        <Link
          to=""
          onClick={(e) => {
            setIsSignIn((prevValue) => !prevValue);
          }}
        >
          <Box display="flex" justifyContent="center">
            <Typography fontWeight={600} color="#ff9832">
              <Typography component="span" color={theme.palette.text.primary}>
                or
              </Typography>
              {" Sign"} {isSignIn ? "up " : "in "}
              {isSignIn ? "for a new" : "to your existing"} account
            </Typography>
          </Box>
        </Link>
      </Typography>
      <AuthForm isSignIn={isSignIn} />
    </Box>
  );
}
