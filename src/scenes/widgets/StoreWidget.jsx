import {
    WorkOutlineOutlined,
    DescriptionOutlined,
    CheckCircleOutlined,
    ContactsOutlined,
    BusinessOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Compliance from "components/Compliance";

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
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false)
    const [visitdate,setDate] = useState()
    const [todo,setAddTODO] = useState({})

    useEffect(() => {
        visitdate !== undefined && setAddTODO({...store,visitdate:dayjs(visitdate).format("DD-MM-YYYY")})
    },[visitdate,store])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };

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
                    <Compliance isOpen={open} onClose={handleClose} store={store} />
                    <IconButton onClick={handleOpen} >
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
                <FlexBetween gap="0.3rem">
                    <IconButton onClick={() => navigate("/map")}>
                        <ContactsOutlined />
                    </IconButton>
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                        {phone}
                    </Typography>
                </FlexBetween>
                <Divider />
                <br/>
                <FlexBetween gap="0.3rem">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker label="Pick visit date" value={visitdate} onChange={(newValue) => setDate(newValue)} onAccept={handleTodo}/>
                    </LocalizationProvider>
                    <IconButton>
                        <WorkOutlineOutlined />
                    </IconButton>
                </FlexBetween>

            </Box>
        </WidgetWrapper>
    );
};

export default StoreWidget;
