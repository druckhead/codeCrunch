import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { Divider, Drawer, useTheme } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ColorModeContext } from "../../App";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CodeCrunchLogoLight from "../../assets/logo-light.svg";
import CodeCrunchLogoDark from "../../assets/logo-dark.svg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import FeedIcon from "@mui/icons-material/Feed";
import styles from "./NavBar.module.css";

import {
  USER_ACTIONS,
  User,
  useUser,
  useUserDispactch,
} from "../../context/UserContext";
import axios from "axios";
import {
  LOCATION_ACTIONS,
  usePrevLocation,
  usePrevLocationDispactch,
} from "../../context/LocationContext";
import { ERoutes } from "../../utils/endpointConstants";

const NavBar = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [open, setOpen] = React.useState(false);
  const user = useUser();
  const userDispatch = useUserDispactch();
  const location = useLocation();
  const prevLocationDispatch = usePrevLocationDispactch();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handlePrevLocation = () => {
    prevLocationDispatch({
      type: LOCATION_ACTIONS.SET_PREVIOUS_LOCATION,
      payload: location,
    });
    handleDrawerClose();
  };

  const handleSignOut = (event: React.MouseEvent) => {
    const logout = async () => {
      const response = await axios.post(LOGOUT_URL, {
        refresh: user.refreshToken,
      });
      userDispatch({
        type: USER_ACTIONS.BLACKLIST,
        payload: { refreshToken: user.refreshToken },
      });
      navigate("/sign_in");
    };
    logout();
    handlePrevLocation();
  };

  function navigationPage(
    user: User,
    page: string,
    type: string,
    index?: number
  ) {
    if (user.isLoggedIn) {
      if (page === "Sign in") return null;
    } else {
      if (page === "Sign out") return null;
    }
    if (type === "navbar") {
      return (
        <Link
          to={page.replace(" ", "_").toLowerCase()}
          key={page}
          className={styles.hoverUnderlineAnimation}
          style={{ color: theme.palette.text.primary }}
        >
          <Typography
            onClick={
              page === "Sign out"
                ? handleSignOut
                : "/" + page.replace(" ", "_").toLowerCase() !==
                    location.pathname &&
                  "/" + page.replace(" ", "_").toLowerCase() !== "/sign_in"
                ? handlePrevLocation
                : handleDrawerClose
            }
            className={
              "/" + page.replace(" ", "_").toLowerCase() ===
                location.pathname ||
              (page === "Sign in" && location.pathname === "/sign_up")
                ? styles.underline
                : ""
            }
          >
            {page}
          </Typography>
        </Link>
      );
    } else {
      return (
        <Link
          key={page}
          to={page.replace(" ", "_").toLowerCase()}
          style={{ color: theme.palette.text.primary }}
        >
          <MenuItem
            onClick={
              page === "Sign out"
                ? handleSignOut
                : "/" + page.replace(" ", "_").toLowerCase() !==
                    location.pathname &&
                  "/" + page.replace(" ", "_").toLowerCase() !== "/sign_in"
                ? handlePrevLocation
                : handleDrawerClose
            }
          >
            <Box display="flex" gap={1}>
              {pagesIcons[index!]}
              <Typography color="inherit" textAlign="center">
                {page}
              </Typography>
            </Box>
          </MenuItem>
        </Link>
      );
    }
  }

  useEffect(() => {
    if (!user.isLoggedIn) {
      if (location.pathname !== "/sign_in") {
        if (location.pathname !== "/" && location.pathname !== "/sign_up") {
          prevLocationDispatch({
            type: LOCATION_ACTIONS.SET_PREVIOUS_LOCATION,
            payload: location,
          });
          navigate("/sign_in");
        }
      }
    }
  }, [user.isLoggedIn, location.pathname]);

  return (
    <AppBar
      position="static"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: "inherit",
        color: theme.palette.text.primary,
        mb: 5,
      }}
    >
      <Container
        maxWidth={false}
        sx={{ backgroundColor: theme.palette.background.default }}
      >
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
                  ".MuiDivider-root": {
                    m: 0,
                  },
                }}
              >
                <Link
                  to="/"
                  style={{ color: "inherit" }}
                  onClick={handleDrawerClose}
                >
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
                {pages.map((page, index) =>
                  navigationPage(user, page, "drawer", index)
                )}
                <Divider />
                <MenuItem onClick={colorMode.toggleColorMode}>
                  <Box display="flex" gap={1}>
                    {colorMode.getIsAutoMode() ? (
                      <BrightnessAutoIcon />
                    ) : theme.palette.mode === "light" ? (
                      <LightModeIcon />
                    ) : (
                      <DarkModeIcon />
                    )}
                    <Typography color="inherit" textAlign="center">
                      Theme
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDrawerClose}>
                  <Link
                    to="https://github.com/druckhead/"
                    target="_blank"
                    style={{ color: "inherit" }}
                  >
                    <Box display="flex" gap={1}>
                      <GitHubIcon />
                      <Typography color="inherit" textAlign="center">
                        Github
                      </Typography>
                    </Box>
                  </Link>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>

          <Box
            sx={{ flexGrow: 0, display: { xs: "none", sm: "flex" }, gap: 2 }}
          >
            {pages.map((page) => navigationPage(user, page, "navbar"))}
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              bgcolor: "inherit",
              color: "text.primary",
              borderRadius: 1,
              flexGrow: 0,
              "&.MuiBox-root .MuiIconButton-root:hover": {
                backgroundColor: "transparent",
                color: "#ffa94c",
              },
            }}
          >
            <Link
              to="https://github.com/druckhead/"
              target="_blank"
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
};

export default NavBar;

const { API_BASE_URL, TOKEN_PREFIX, LOGOUT } = ERoutes;
const LOGOUT_URL = `${API_BASE_URL}${TOKEN_PREFIX}${LOGOUT}`;

const pages = ["Feed", "Dashboard", "Profile", "Sign in", "Sign out"];
const pagesIcons = [
  <FeedIcon />,
  <DashboardIcon />,
  <AccountBoxIcon />,
  <LoginIcon />,
  <LogoutIcon />,
];
