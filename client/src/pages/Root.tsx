import React from "react";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";

export default function Root() {
  return (
    <React.Fragment>
      <Box component="header">
        <NavBar />
      </Box>
      <Container>
        <Outlet />
      </Container>
    </React.Fragment>
  );
}
