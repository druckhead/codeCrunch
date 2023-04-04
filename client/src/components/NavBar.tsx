import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Divider, Drawer, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ColorModeContext } from "../App";
import { Link } from "react-router-dom";
import CodeCrunchLogoLight from "../assets/logo-light.svg";
import CodeCrunchLogoDark from "../assets/logo-dark.svg";

const pages = ["Dashboard", "Profile", "Sign in"];

export default function NavBar() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl" sx={{ backgroundColor: "inherit" }}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", lg: "space-around" },
          }}
        >
          <Link to="/" style={{ color: "inherit" }}>
            <Box component="div" display="flex" gap={0.75}>
              <img
                src={
                  theme.palette.mode === "dark"
                    ? CodeCrunchLogoDark
                    : CodeCrunchLogoLight
                }
                alt="company logo"
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", lg: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".25rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                codeCrunch
              </Typography>
            </Box>
          </Link>
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              flexGrow: 0,
              display: { xs: "flex", sm: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
              <Box
                sx={{
                  backgroundColor: "inherit",
                  width: { xs: "75vw", sm: "40vw" },
                  height: "100%",
                }}
              >
                <Link to="/" style={{ color: "inherit" }}>
                  <Container sx={{ px: 1.5, py: 1.25 }}>
                    <Box component="div" display="flex" gap={2}>
                      <img
                        src={
                          theme.palette.mode === "dark"
                            ? CodeCrunchLogoDark
                            : CodeCrunchLogoLight
                        }
                        alt="company logo"
                      />
                      <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                          mr: 2,
                          display: "flex",
                          fontFamily: "monospace",
                          fontWeight: 500,
                          letterSpacing: ".1rem",
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        codeCrunch
                      </Typography>
                    </Box>
                  </Container>
                </Link>
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleDrawerClose}>
                    <Typography color="inherit" textAlign="center">
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "unset",
                    color: "text.primary",
                    borderRadius: 1,
                    p: 3,
                  }}
                >
                  <Link
                    to="https://github.com/druckhead/"
                    style={{ color: "inherit" }}
                  >
                    <IconButton color="inherit" onClick={handleDrawerClose}>
                      <GitHubIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    onClick={colorMode.toggleColorMode}
                    color="inherit"
                  >
                    {colorMode.getIsAutoMode() ? (
                      <BrightnessAutoIcon />
                    ) : theme.palette.mode === "light" ? (
                      <LightModeIcon />
                    ) : (
                      <DarkModeIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Drawer>
          </Box>

          <Box
            sx={{ flexGrow: 0, display: { xs: "none", sm: "flex" }, gap: 2 }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleDrawerClose}
                sx={{
                  my: 2,
                  fontWeight: 600,
                  color: "inherit",
                  display: "block",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              bgcolor: "inherit",
              color: "text.primary",
              borderRadius: 1,
              flexGrow: 0,
            }}
          >
            <Link
              to="https://github.com/druckhead/"
              style={{ color: "inherit" }}
            >
              <IconButton color="inherit">
                <GitHubIcon />
              </IconButton>
            </Link>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {colorMode.getIsAutoMode() ? (
                <BrightnessAutoIcon />
              ) : theme.palette.mode === "light" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
