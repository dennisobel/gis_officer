import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useDropzone } from "react-dropzone";
import "react-tabs/style/react-tabs.css";
import { setBusinessReg } from "state";
import { useDispatch } from "react-redux";
import BusinessReg from "components/BusinessReg";
import Navbar from "scenes/navbar";

const BusinessRegPage = (props) => {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div className="thumb" key={file.name}>
      <div className="thumbInner">
        <img src={file.preview} alt="img" />
      </div>
    </div>
  ));

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((pstn) => {
      const { latitude, longitude } = pstn.coords;
      dispatch(setBusinessReg({ latitude, longitude }));
    });
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
        <main className="flex-1">
          <Navbar/>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <BusinessReg />
          </div>
        </main>
  );
};

export default BusinessRegPage;
