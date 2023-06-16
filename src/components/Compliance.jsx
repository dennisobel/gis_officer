import React, { useState } from "react";
import { Box, useTheme, Button, Modal, TextField, Typography, InputLabel, useMediaQuery } from "@mui/material";
import validator from "validator";
import { useSelector } from "react-redux";
import { initiateSTK } from "helper/helper";

const Compliance = ({ isOpen, onClose, store }) => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const location = useSelector(state => state.currentLocation)
    const { palette } = useTheme();
    const main = palette.neutral.main;

    const [formValues, setFormValues] = useState({
        amount: "",
    });

    const [formErrors, setFormErrors] = useState({
        amount: false,
    });

    const handleChange = (e) => {
        e.preventDefault()
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("inside submit")
        const errors = {
            amount: validator.isEmpty(formValues.amount),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            console.log("Compliance submitted successfully:", formValues, store);
            let stkPromise = await initiateSTK({store_id:store._id, amount: formValues.amount, msisdn:"254727677068"},location)
            stkPromise.then(res => console.log("STK RES",res))
        }

        // await onClose();
    };


    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                bgcolor={"white"}
                gap="0.5rem"
                justifyContent="space-between">
                <Box component="form">
                    <Typography variant="h6" gutterBottom>
                        Pay
                    </Typography>
                    <form>
                        <InputLabel id="select-label">Amount</InputLabel>
                        <TextField
                            size="small"
                            required
                            fullWidth
                            margin="normal"
                            name="amount"
                            value={formValues.amount}
                            onChange={handleChange}
                            error={formErrors.amount}
                            helperText={formErrors.amount && "Please enter your amount"}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={handleSubmit}
                            sx={{
                                margin: "auto",
                                display: "block",
                                marginTop: 4,
                                paddingX: 4,
                                paddingY: 2,
                                borderRadius: 2,
                                boxShadow: "none",
                                backgroundColor: main,
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#0039cb",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Update Compliance
                        </Button>
                    </form>
                </Box>
            </Box>
        </Modal>
    )

}

export default Compliance