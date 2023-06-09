import React, { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth/AuthPage";
import { useUser } from "./context/UserContext";
import { usePrevLocation } from "./context/LocationContext";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed/Feed";
import ExpandedPost from "./pages/ExpandedPost";

export const ColorModeContext = React.createContext({
  getIsAutoMode: (): boolean => {
    return false;
  },
  toggleColorMode: () => {},
});

export default function App() {
  const [mode, setMode] = React.useState<"light" | "dark">("dark");
  const [isAutoMode, setIsAutoMode] = React.useState<boolean>(true);
  const prefersDarkMode = useMediaQuery(`(prefers-color-scheme: dark)`);
  const user = useUser();
  const location = useLocation();
  const prevLocation = usePrevLocation();
  const isSignIn = location.pathname === "/sign_in";

  const themeAuto = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const colorMode = React.useMemo(
    () => ({
      getIsAutoMode: (): boolean => {
        return isAutoMode;
      },
      toggleColorMode: () => {
        setMode((prevMode) => {
          if (isAutoMode) {
            setIsAutoMode(false);
            return "dark";
          }
          switch (prevMode) {
            case "dark":
              return "light";
            case "light":
              setIsAutoMode(true);
              return "dark";
            default:
              return "dark";
          }
        });
      },
    }),
    [isAutoMode]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  useEffect(() => {
    console.log(`logged in: ${user.isLoggedIn}`, location, prevLocation);
  }, [location.pathname, prevLocation.pathname]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={isAutoMode ? themeAuto : theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<HomePage />} />
            <Route
              path="/feed"
              element={user.isLoggedIn ? <Feed /> : <Navigate to="/sign_in" />}
            />
            <Route
              path="/dashboard"
              element={
                user.isLoggedIn ? <Dashboard /> : <Navigate to="/sign_in" />
              }
            />
            <Route
              path="/profile"
              element={
                user.isLoggedIn ? (
                  <div>profile</div>
                ) : (
                  <Navigate to="/sign_in" />
                )
              }
            />
            <Route
              path="sign_in"
              element={
                user.isLoggedIn ? (
                  <Navigate to={prevLocation.pathname} />
                ) : (
                  <AuthPage isSignInOuter={isSignIn} />
                )
              }
            />
            <Route
              path="sign_up"
              element={
                user.isLoggedIn ? (
                  <Navigate to={prevLocation.pathname} />
                ) : (
                  <AuthPage isSignInOuter={isSignIn} />
                )
              }
            />
            <Route path="posts/:postId" element={<ExpandedPost />} />
            <Route path="sign_out" element={<Navigate to="/sign_in" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
