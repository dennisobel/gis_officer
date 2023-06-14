import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import { ArrowUpwardOutlined } from "@mui/icons-material";
import { getUsername } from "helper/helper";
import { useState, useEffect } from "react";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const [user, setUser] = useState()

  useEffect(() => {
    getUsername()
      .then(user => setUser(user))
  }, [])

  const handleReturnToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


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
          <UserWidget userId={user?.msisdn} picturePath={""} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* <MyPostWidget picturePath={""} /> */}
          <PostsWidget userId={user?.msisdn} />
          <ArrowUpwardOutlined fontSize="small" sx={{position:"fixed", bottom:10, left:1, color:dark}} onClick={handleReturnToTop}>
            Return to Top
          </ArrowUpwardOutlined>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
