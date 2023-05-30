import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
    ArrowBackOutlined,
    Search
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setSearchStoreQuery } from "state";
import { getUsername } from "helper/helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchStoreWidget = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const [user, setUser] = useState()
    const [query, setQuery] = useState()
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
    }, [])

    const handleInputChange = (event) => {
        dispatch(setSearchStoreQuery(event.target.value));
        setQuery(event.target.value)
    };

    return (
        <WidgetWrapper>
            <div style={{ position: "" }}>
                <FlexBetween gap="1.5rem">
                    <IconButton onClick={() => navigate("/home")}>
                        <ArrowBackOutlined />
                    </IconButton>

                    <FlexBetween
                        backgroundColor={neutralLight}
                        borderRadius="9px"
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                    >
                        <InputBase
                            placeholder="Filter"
                            onChange={handleInputChange}
                            sx={{
                                width: "100%",
                                backgroundColor: palette.neutral.light,
                                borderRadius: "2rem",
                                padding: "1rem 2rem",
                            }}
                        />
                    </FlexBetween>

                </FlexBetween>
            </div>
        </WidgetWrapper>
    );
};

export default SearchStoreWidget;
