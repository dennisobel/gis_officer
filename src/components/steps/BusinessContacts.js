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

export default function BusinessContacts() {
  const dispatch = useDispatch()
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [formValues,setFormValues] = useState({
    business_email:"",
    business_phone:"",
    postal_address: "",
    postal_code: "",
    contact_person_id: "",
    contact_person_role: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: ""
  })

  const handleChange = (e) => {
    e.preventDefault()
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(()=>{
    dispatch(setBusinessReg(formValues))
  },[formValues])

  const handleRegistration = () => {

  }

  return (
    <WidgetWrapper>
      <div className="text-center">
        <p className="text-gray-700 text-lg mb-8 text-4xl font-bold">
          Business Contacts
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Email
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["business_email"] || ""}
              name="business_email"
              placeholder="Enter email address"
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
            Enter company phone number
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["business_phone"] || ""}
              name="business_phone"
              placeholder="Enter phone number"
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
            Postal Address
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["postal_address"] || ""}
              name="postal_address"
              placeholder="Enter postal address"
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
            Enter postal code
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["postal_code"] || ""}
              name="postal_code"
              placeholder="Enter postal code"
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

      <hr />
      <div className="text-center">
        <p className="text-gray-700 text-lg mb-8 text-4xl font-bold">
          Contact Person
        </p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            National ID
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["contact_person_id"] || ""}
              name="contact_person_id"
              placeholder="eg 27912653"
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
            Role in business
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["contact_person_role"] || ""}
              name="contact_person_role"
              placeholder="Role of contact person"
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
            First name of contact person
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["contact_person_name"] || ""}
              name="contact_person_name"
              placeholder="eg John Doe"
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
            Email of contact person
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["contact_person_email"] || ""}
              name="contact_person_email"
              placeholder="eg john.doe@mail.com"
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
            Phone number of contact person
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["contact_person_phone"] || ""}
              name="contact_person_phone"
              placeholder="eg 0712345678"
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
      <Divider sx={{ margin: "1.25rem 0" }} />
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Receipt</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          onClick={handleRegistration}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          ADD
        </Button>
      </FlexBetween>
      </WidgetWrapper>
  );
}
