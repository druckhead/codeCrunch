import React from "react";
import NavBar from "../components/Navbar/NavBar";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

export default function Root() {
  return (
    <React.Fragment>
      <NavBar />
      <Container sx={{ my: 2 }}>
        <Outlet />
      </Container>
    </React.Fragment>
  );
}
