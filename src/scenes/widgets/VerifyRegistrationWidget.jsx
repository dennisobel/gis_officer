import {
    Divider,
    InputBase,
    useTheme,
    Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useState } from "react";
import validator from "validator";
import { verifyBusiness } from "helper/helper";
/**TOAST IMPORTS */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyRegistrationWidget = ({ store }) => {
    const { palette } = useTheme();
    const location = useSelector(state => state.currentLocation)
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

    const handleVerify = async (event) => {
        event.preventDefault()
        const errors = {
            receipt_no: validator.isEmpty(formValues.receipt_no),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            console.log("Compliance submitted successfully:", formValues, store);
            let verificationPromise = verifyBusiness({
                store_id: store._id,
                verified: true
            },location)
            verificationPromise.then(res => {
                console.log("RES:",res)
                toast.success("Receipt has been verified")
            }).catch(err => {
                console.error("ERR:",err)
                toast.error("Something went wrong in verification")
            })
        }
    }

    return (
        <WidgetWrapper>
            <ToastContainer/>
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
                        onClick={handleVerify}
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
