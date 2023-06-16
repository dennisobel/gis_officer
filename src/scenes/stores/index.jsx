import { Box, useMediaQuery } from "@mui/material";
import SearchStoreWidget from "scenes/widgets/SearchStoreWidget";
import StoresWidget from "scenes/widgets/StoresWidget";
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
            <SearchStoreWidget picturePath={""} />
            <Box
                width="100%"
                padding="0.5rem 5%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <StoresWidget userId={user?.msisdn} />
                </Box>
            </Box>
        </Box>
    )
}

export default StoresPage