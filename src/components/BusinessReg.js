import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useDropzone } from "react-dropzone";
import "react-tabs/style/react-tabs.css";
import { setBusinessReg } from "state";
import { useDispatch } from "react-redux";
import BusinessActivity from "components/steps/BusinessActivity";
import BusinessCategory from "components/steps/BusinessCategory";
import BusinessContacts from "components/steps/BusinessContacts";
import BusinessDetails from "components/steps/BusinessDetails";

const BusinessReg = (props) => {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();


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
    <div className="section">
      <Tabs>
        <div className="container">
          <div className="flex flex-row justify-between items-center">
            <TabList className="flex flex-row mb-4 border-b">
              <Tab className="px-4 py-2 font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 cursor-pointer">
                <span>01</span>
              </Tab>
              <Tab className="px-4 py-2 font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 cursor-pointer">
                <span>02</span>
              </Tab>
              <Tab className="px-4 py-2 font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 cursor-pointer">
                <span>03</span>
              </Tab>
              <Tab className="px-4 py-2 font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 cursor-pointer">
                <span>04</span>
              </Tab>
            </TabList>
          </div>

          <TabPanel>
            <div className="row">
              <div className="col-md-12 form-group">
                <BusinessCategory />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            {/* <div className="flex-shrink-0">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </div> */}
            <div className="col-md-12 form-group">
              <BusinessDetails />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="row">
              <div className="col-md-12 form-group">
                <BusinessActivity />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="row">
              <div className="col-md-12 form-group">
                <BusinessContacts />
              </div>
            </div>
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default BusinessReg;
