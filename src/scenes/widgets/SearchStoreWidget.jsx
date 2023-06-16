import { ArrowBackOutlined } from "@mui/icons-material";
import { InputBase, useTheme, IconButton } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch } from "react-redux";
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
        </WidgetWrapper>
    );
};

export default SearchStoreWidget;
