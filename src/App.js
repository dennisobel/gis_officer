import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import OtpPage from "scenes/otp";
import ProfilePage from "scenes/profilePage";
import Map from "scenes/map";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { getUsername } from "helper/helper";
import StoresPage from "scenes/stores";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  const user = getUsername();

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/otp"
              element={user ? <OtpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/home"
              element={user ? <HomePage /> : <Navigate to="/" />}
            />
            <Route path="/map" element={user ? <Map /> : <Navigate to="/" />} />
            <Route path="/stores" element={user ? <StoresPage /> : <Navigate to="/" />} />
            <Route
              path="/profile/:userId"
              element={user ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
