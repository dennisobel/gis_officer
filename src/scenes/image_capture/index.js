import React,{ useState,useEffect } from 'react'
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { getUsername } from "helper/helper";

function ImageCapturePage() {
  const [user,setUser] = useState()

  useEffect(()=>{
    getUsername()
    .then(user => setUser(user))
  },[])

  return (
    <Box>
      <Navbar />
    </Box>
  )
}

export default ImageCapturePage