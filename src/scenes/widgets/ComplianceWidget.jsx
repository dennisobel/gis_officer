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
import { initiateSTK, escalate, verifyTransaction } from "helper/helper";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useDropzone } from "react-dropzone";
import "react-tabs/style/react-tabs.css";
/**TOAST IMPORTS */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ComplianceWidget = ({ picturePath, store }) => {
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
            stkPromise.then(res => {
                console.log("STK RES", res)
                toast.success("Payment successfully initiated.")
            }).catch(err => console.error("ERR:",err))
        }

        // await onClose();
    };

    const handleVerify = async (event) => {
        event.preventDefault()
        const errors = {
            receipt_no: validator.isEmpty(formValues.receipt_no),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            console.log("Compliance submitted successfully:", formValues, store);
            let verificationPromise = verifyTransaction({
                store: store._id,
                receipt_no: formValues.receipt_no
            })
            verificationPromise.then(res => {
                console.log("RES:",res)
                toast.success("Receipt has been verified")
            }).catch(err => {
                console.error("ERR:",err)
                toast.error("Something went wrong in verification")
            })
        }
    }

    const handleEscalate = async (event) => {
        console.log("in handleescalate:",store)
        event.preventDefault()
        const errors = {
            escalation_reason: validator.isEmpty(formValues.escalation_reason),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            await escalate(
                {
                    store_id:store?._id, 
                    reason:formValues.escalation_reason, 
                    escalate:true
                },
                location
            ).then((res) => {
                console.log("RES:",res)
                toast.success("Issue successfully escalated.")
            }).catch(err => console.error("ERR:",err))
        }
    }

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
    }, [])

    return (
        <WidgetWrapper>
            <div className="section">
                <Tabs>
                    <div className="container">
                        <div className="flex flex-row justify-between items-center">
                            <TabList className="flex flex-row mb-4 border-b">
                                <Tab className="px-4 py-2 font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 cursor-pointer">
                                    <span>Payment</span>
                                </Tab>
                                <Tab className="px-4 py-2 font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 cursor-pointer">
                                    <span>Verify</span>
                                </Tab>
                                <Tab className="px-4 py-2 font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 cursor-pointer">
                                    <span>Escalate</span>
                                </Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <div style={{ position: "sticky" }}>
                                <FlexBetween gap="1.5rem">
                                    <InputBase
                                        placeholder="Capture compliance"
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
                                        INITIATE PAYMENT
                                    </Button>
                                </FlexBetween>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div style={{ position: "sticky" }}>
                                <FlexBetween gap="1.5rem">
                                    <InputBase
                                        placeholder="Receipt No."
                                        name="receipt_no"
                                        value={formValues.receipt_no}
                                        onChange={handleChange}
                                        sx={{
                                            width: "100%",
                                            backgroundColor: palette.neutral.light,
                                            borderRadius: "0.3rem",
                                            padding: "1rem 2rem",
                                        }}
                                        error={formErrors.receipt_no}
                                        helperText={formErrors.receipt_no && "Please enter your receipt number"}
                                    />
                                </FlexBetween>
                                <Divider sx={{ margin: "1.25rem 0" }} />
                                <FlexBetween>
                                    <Button
                                        disabled={!formValues.receipt_no}
                                        onClick={handleVerify}
                                        sx={{
                                            color: palette.background.alt,
                                            backgroundColor: palette.primary.main,
                                            borderRadius: "0.3rem",
                                        }}
                                    >
                                        VERIFY PAYMENT CLAIM
                                    </Button>
                                </FlexBetween>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div style={{ position: "sticky" }}>
                                <FlexBetween gap="1.5rem">
                                    <InputBase
                                        placeholder="Reason for escalation"
                                        name="escalation_reason"
                                        value={formValues.escalation_reason}
                                        onChange={handleChange}
                                        sx={{
                                            width: "100%",
                                            backgroundColor: palette.neutral.light,
                                            borderRadius: "0.3rem",
                                            padding: "1rem 2rem",
                                        }}
                                        error={formErrors.escalation_reason}
                                        helperText={formErrors.escalation_reason && "Please enter your reasons"}
                                    />
                                </FlexBetween>
                                <Divider sx={{ margin: "1.25rem 0" }} />
                                <FlexBetween>
                                    <Button
                                        disabled={!formValues.escalation_reason}
                                        onClick={handleEscalate}
                                        sx={{
                                            color: palette.background.alt,
                                            backgroundColor: palette.primary.main,
                                            borderRadius: "0.3rem",
                                        }}
                                    >
                                        ESCALATE
                                    </Button>
                                </FlexBetween>
                            </div>
                        </TabPanel>
                    </div>
                </Tabs>
            </div>

        </WidgetWrapper>
    );
};

export default ComplianceWidget;
