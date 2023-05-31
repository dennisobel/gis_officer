import React, { useState, useRef } from "react";
import { Box, useTheme, Button, Modal, TextField, Typography, Select, MenuItem, InputLabel, useMediaQuery } from "@mui/material";
import { useDispatch } from "react-redux";
import validator from "validator";
import MyPostWidget from "scenes/widgets/MyPostWidget";

const Compliance = ({ isOpen, onClose }) => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const dispatch = useDispatch();

    const options = [
        { value: "paid", label: "Paid" },
        { value: "partially paid", label: "Partially Paid" },
        { value: "not paid", label: "Not Paid" },
    ];

    const [formValues, setFormValues] = useState({
        amount: "",
        compliance: ""
    });

    const [formErrors, setFormErrors] = useState({
        amount: false,
        compliance: false,
    });

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = {
            amount: validator.isEmpty(formValues.amount),
            compliance: validator.isEmpty(formValues.compliance),
        };

        setFormErrors(errors);

        if (!Object.values(errors).some(Boolean)) {
            //   dispatch(setRevenueOfficer(formValues))
            console.log("Compliance submitted successfully:", formValues);
        }

        onClose();
    };


    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                bgcolor={"white"}
                gap="0.5rem"
                justifyContent="space-between">
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>
                        Compliance Check
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <InputLabel id="select-label">Compliance</InputLabel>
                        <Select
                            size="small"
                            name="compliance"
                            required
                            fullWidth
                            margin="normal"
                            value={formValues.compliance}
                            onChange={handleChange}
                        >
                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>

                        <InputLabel id="select-label">Amount</InputLabel>
                        <TextField
                            size="small"
                            required
                            fullWidth
                            margin="normal"
                            name="name"
                            value={formValues.amount}
                            onChange={handleChange}
                            error={formErrors.amount}
                            helperText={formErrors.amount && "Please enter your amount"}
                        />
                        <Button
                            variant="contained"
                            type="submit"
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
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <MyPostWidget picturePath={""} />
                </Box>
            </Box>
        </Modal>
    )

}

export default Compliance