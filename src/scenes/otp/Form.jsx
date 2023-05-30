import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { generateOTP, verifyOTP, getUsername } from '../../helper/helper';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const otpSchema = yup.object().shape({
  otp: yup.string().required("required"),
});

const initialValues = {
  otp: "",
};

const Form = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState()
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUsername();
        setUser(res);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const msisdn = user?.msisdn;
      if (msisdn) {
        generateOTP(msisdn)
          .then((OTP) => {
            console.log(OTP);
            if (OTP) {
              toast.success('OTP has been sent to your SMS!');
            } else {
              toast.error('Problem while generating OTP!');
            }
          })
          .catch((error) => {
            console.log("Error generating OTP:", error);
          });
      } else {
        console.log("Email not found");
      }
    }
  }, [user]);

  const submitOtp = async (values, onSubmitProps) => {
    console.log("verify")
    let { status } = await verifyOTP({ msisdn: user?.msisdn, code: values.otp })
    if (status === 201) {
      toast.success('Verify Successfully!')
      navigate("/home")
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values)
    await submitOtp(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={otpSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="OTP"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.otp}
              name="otp"
              error={Boolean(touched.otp) && Boolean(errors.otp)}
              helperText={touched.otp && errors.otp}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              SUBMIT
            </Button>
            <Typography
              onClick={() => {
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
