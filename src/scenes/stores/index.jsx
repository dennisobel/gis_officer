import { Box, useMediaQuery, useTheme } from "@mui/material";
import { ArrowUpwardOutlined } from "@mui/icons-material";
import SearchStoreWidget from "scenes/widgets/SearchStoreWidget";
import StoresWidget from "scenes/widgets/StoresWidget";
import { getUsername } from "helper/helper";
import { useState, useEffect } from "react";

function StoresPage() {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [user, setUser] = useState()
    const { palette } = useTheme();
    const dark = palette.neutral.dark;

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
    }, [])

    const handleReturnToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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
                    flexBasis={isNonMobileScreens ? "%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <StoresWidget userId={user?.msisdn} />
                    <ArrowUpwardOutlined fontSize="small" sx={{ position: "fixed", bottom: 10, left: 1, color: dark }} onClick={handleReturnToTop} />
                </Box>
            </Box>
        </Box>
    )
}

export default StoresPage