import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    DescriptionOutlined,
    CheckCircleOutlined,
    ContactsOutlined,
    BusinessOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPost } from "state";

const StoreWidget = ({
    branch,
    category,
    description,
    email,
    phone,
    paymentstatus,
    store_no
}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;


    return (
        <WidgetWrapper m="2rem 0">
            {/* <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        /> */}
            {/* <Typography color={main} sx={{ mt: "1rem" }}>
          {building_number}
        </Typography> */}

            <FlexBetween gap="0.3rem">
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    Store # {store_no}
                </Typography>
                <FlexBetween gap="0.3rem">
                    <IconButton >
                        <CheckCircleOutlined />
                    </IconButton>
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                        {paymentstatus}
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            <FlexBetween gap="0.3rem">
                <FlexBetween gap="0.3rem">
                    <IconButton >
                        <DescriptionOutlined />
                    </IconButton>
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                        {description}
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            {/* {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        )} */}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={() => navigate("/map")}>
                            <BusinessOutlined />
                        </IconButton>
                        <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                            {branch}
                        </Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        {/* <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton> */}
                        <Typography>Category # {category}</Typography>
                    </FlexBetween>
                </FlexBetween>

                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            <Box>
                <Divider />
                <FlexBetween gap="0.3rem">
                    <IconButton onClick={() => navigate("/map")}>
                        <ContactsOutlined />
                    </IconButton>
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                        {phone}
                    </Typography>
                </FlexBetween>
            </Box>
            {/* {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )} */}
        </WidgetWrapper>
    );
};

export default StoreWidget;
