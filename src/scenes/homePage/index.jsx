import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { ArrowUpwardOutlined } from "@mui/icons-material";
import { getUsername } from "helper/helper";
import { useState, useEffect } from "react";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  // const { _id, picturePath } = useSelector((state) => state.user);
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
          <ArrowUpwardOutlined sx={{position:"fixed", bottom:10, left:1}} onClick={handleReturnToTop}>
            Return to Top
          </ArrowUpwardOutlined>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
