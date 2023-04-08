import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Route, Routes } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={isAutoMode ? themeAuto : theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<HomePage />} />
            <Route path="sign_in" element={<AuthPage />} />
            <Route path="sign_up" element={<AuthPage />} />
            <Route path="signout" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
