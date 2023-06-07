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
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { getUsername } from "helper/helper";
import { useEffect, useState } from "react";
import validator from "validator";
import { initiateSTK } from "helper/helper";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useDropzone } from "react-dropzone";
import "react-tabs/style/react-tabs.css";

const VerifyRegistrationWidget = ({ picturePath, store }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const location = useSelector(state => state.currentLocation)
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const [user, setUser] = useState()
    const [formValues, setFormValues] = useState({
        amount: "",
        receipt_no: "",
        escalation_reason: ""
    });

    const [formErrors, setFormErrors] = useState({
        amount: false,
        receipt_no: false,
        escalation_reason: false
    });

    const handleChange = (e) => {
        e.preventDefault()
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handlePay = async (event) => {
        event.preventDefault();
        const errors = {
            amount: validator.isEmpty(formValues.amount),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            console.log("Compliance submitted successfully:", formValues, store);
            let stkPromise = await initiateSTK({ store_id: store._id, amount: formValues.amount, msisdn: "254727677068" }, location)
            stkPromise.then(res => console.log("STK RES", res))
        }

        // await onClose();
    };

    const handleVerify = (event) => {
        event.preventDefault()
        const errors = {
            receipt_no: validator.isEmpty(formValues.receipt_no),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            console.log("Compliance submitted successfully:", formValues, store);
        }
    }

    const handleEscalate = (event) => {
        event.preventDefault()
        const errors = {
            escalation_reason: validator.isEmpty(formValues.escalation_reason),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            console.log("Compliance submitted successfully:", formValues, store);
        }
    }

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
    }, [])

    return (
        <WidgetWrapper>
            <div style={{ position: "sticky" }}>
                <FlexBetween gap="1.5rem">
                    <InputBase
                        placeholder="Registration notes"
                        name="amount"
                        value={formValues.amount}
                        onChange={handleChange}
                        sx={{
                            width: "100%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "0.3rem",
                            padding: "1rem 2rem",
                        }}
                        error={formErrors.amount}
                        helperText={formErrors.amount && "Please enter your amount"}
                    />
                </FlexBetween>
                <Divider sx={{ margin: "1.25rem 0" }} />
                <FlexBetween>
                    <Button
                        disabled={!formValues.amount}
                        onClick={handlePay}
                        sx={{
                            color: palette.background.alt,
                            backgroundColor: palette.primary.main,
                            borderRadius: "0.3rem",
                        }}
                    >
                        VERIFY REGISTRATION
                    </Button>
                </FlexBetween>
            </div>
        </WidgetWrapper>
    );
};

export default VerifyRegistrationWidget;
