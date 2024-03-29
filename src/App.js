import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { getUsername } from "helper/helper";

import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import OtpPage from "scenes/otp";
import BusinessRegPage from "scenes/business_reg";
import Map from "scenes/map/old";
import OldMap from "scenes/map/oldmap";
import StoresPage from "scenes/stores";
import StorePage from "scenes/storePage";
import SummariesPage from "scenes/summaries";
import VisitPage from "scenes/visit";

import { setCurrentLocation } from "state";
import { setBusinessReg } from "state";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const user = getUsername();
  const businessReg = useSelector((state) => state.businessReg);
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    location: {},
  });

  useEffect(() => {
    const { code, message } = error || {};
    console.log("Geolocation Error:", code, message);
  }, [error]);

  useEffect(() => {
    const successCallback = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    };

    const errorCallback = (error) => {
      setError(error);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    location !== undefined && dispatch(setCurrentLocation(location));
  }, [location]);

  useEffect(() => {
    location !== undefined &&
      setFormValues({
        location: businessReg?.location || "",
      });
  }, [location]);

  useEffect(() => {
    formValues !== undefined && dispatch(setBusinessReg(formValues));
  }, [formValues, dispatch]);

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
            <Route
              path="/map/:longitude/:latitude/:id"
              element={user ? <Map /> : <Navigate to="/" />}
            />
            <Route
              path="/stores"
              element={user ? <StoresPage /> : <Navigate to="/" />}
            />
            <Route
              path="/store/:storeId"
              element={user ? <StorePage /> : <Navigate to="/" />}
            />
            <Route
              path="/businessregistration"
              element={user ? <BusinessRegPage /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={user ? <SummariesPage /> : <Navigate to="/" />}
            />
            <Route
              path="/visitplan"
              element={user ? <VisitPage /> : <Navigate to="/" />}
            />
            <Route
              path="/map_page"
              element={user ? <OldMap /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;