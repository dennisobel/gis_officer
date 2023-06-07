import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import SearchStoreWidget from "scenes/widgets/SearchStoreWidget";
import StoresWidget from "scenes/widgets/StoresWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { getUsername } from "helper/helper";
import { useState, useEffect } from "react";

function StoresPage() {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [user, setUser] = useState()

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
    }, [])

    return (
        <Box>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <SearchStoreWidget picturePath={""} />
                    <StoresWidget userId={user?.msisdn} />
                </Box>
            </Box>
        </Box>
    )
}

export default StoresPage