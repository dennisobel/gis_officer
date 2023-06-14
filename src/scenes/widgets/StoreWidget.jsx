import {
    WorkOutlineOutlined,
    BusinessOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

/**DATE PICKER LIBS */
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { setTODO } from "state";

const StoreWidget = ({
    store,
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
    const [visitdate,setDate] = useState()
    const [todo,setAddTODO] = useState({})
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    useEffect(() => {
        visitdate !== undefined && setAddTODO({...store,visitdate:dayjs(visitdate).format("DD-MM-YYYY")})
    },[visitdate,store])


    const handleView = () => {
        navigate(`/store/${store._id}`)
    }

    const handleTodo = () => {
        console.log("add to list:", todo)
        dispatch(setTODO(todo))
    }


    return (
        <WidgetWrapper m="2rem 0">
            <FlexBetween gap="0.3rem">
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    Store # {store_no}
                </Typography>
                <FlexBetween gap="0.3rem">
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                        {paymentstatus}
                    </Typography>
                    {/* <IconButton onClick={handleView} >
                        <VisibilityOutlined />
                    </IconButton> */}
                </FlexBetween>
            </FlexBetween>
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={() => navigate("/map")}>
                            <BusinessOutlined />
                        </IconButton>
                        <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                            {category}
                        </Typography>
                    </FlexBetween>
                </FlexBetween>
            </FlexBetween>
            <Box>
                <Divider />
                <br/>
                <FlexBetween gap="0.3rem">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker label="Pick visit date" value={visitdate} onChange={(newValue) => setDate(newValue)} onAccept={handleTodo}/>
                    </LocalizationProvider>
                    <Button variant="text" onClick={handleView} endIcon={<VisibilityOutlined/>} color="neutral">
                        VIEW
                    </Button>
                </FlexBetween>

            </Box>
        </WidgetWrapper>
    );
};

export default StoreWidget;
