import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessReg } from "../../state";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";

export default function BusinessDetails() {
  const dispatch = useDispatch()
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const [formValues, setFormValues] = useState({
    business_name: "",
    branch_name: "",
    street: "",
    sub_county: "",
    ward: "",
    plot_no: "",
    building_name: "",
    floor_no: "",
    room_no: "",
  });

  const handleChange = (e) => {

    e.preventDefault()
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(setBusinessReg(formValues));
  }, [formValues]);
  
  return (
    <WidgetWrapper>
      <div className="text-center">
        <p className="text-gray-700 text-lg mb-8 text-4xl font-bold">
          Business Details
        </p>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Enter business name
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["business_name"] || ""}
              name="business_name"
              placeholder="Enter Business Name"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Enter subsidiary name (e.g Westlands Branch)
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["branch_name"] || ""}
              name="branch_name"
              placeholder="e.g Mavindini Branch "
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Street/Estate Name
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["street"] || ""}
              name="street"
              placeholder="e.g Yinthungu"
              type="text"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            sub-county
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["sub_county"] || ""}
              name="sub_county"
              placeholder="e.g Yinthungu"
              type="text"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            ward
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["ward"] || ""}
              name="ward"
              placeholder="e.g Yinthungu"
              type="text"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Plot/LR No
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["plot_no"] || ""}
              name="plot_no"
              placeholder="Enter Plot Number"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Building Name
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["building_name"] || ""}
              name="building_name"
              placeholder="Enter Building Name"
              type="text"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Floor No (Optional)
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["floor_no"] || ""}
              name="floor_no"
              placeholder="Enter Floor Number"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Room Stall Number (Optional)
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["room_no"] || ""}
              name="room_no"
              placeholder="Enter Room Number"
              type="text"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>
    </WidgetWrapper>
  );
}
