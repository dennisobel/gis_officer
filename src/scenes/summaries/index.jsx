import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import DashWidget from "scenes/widgets/DashWidget";
import { getUsername } from "helper/helper";
import { useState, useEffect } from "react";

const SummariesPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [user, setUser] = useState()

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
    }, [])

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <DashWidget userId={user?.msisdn} />
                </Box>
            </Box>
        </Box>
    )

}

export default SummariesPage