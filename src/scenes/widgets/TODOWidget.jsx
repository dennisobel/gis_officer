import {
    WorkOutlineOutlined,
    DescriptionOutlined,
    CheckCircleOutlined,
    ContactsOutlined,
    BusinessOutlined,
    VisibilityOutlined,
    LocationOnOutlined
} from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    Typography,
    useTheme,
    Paper,
    Button,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox
} from "@mui/material";
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

const TODOWidget = ({
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
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false)
    const [visitdate, setDate] = useState()
    const [todo, setAddTODO] = useState({})
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const [checked, setChecked] = useState([0]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
      };

    return (
        <WidgetWrapper m="2rem 0">
            <Box p="1rem 0">
                <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                    <ListItem
                        key={store._id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="location">
                                <LocationOnOutlined />
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton role={undefined} onClick={handleToggle(store._id)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(store._id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': " " }}
                                />
                            </ListItemIcon>
                            <ListItemText id={""} primary={`${store.business_name} : ${store.store_no}`} />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Box>
        </WidgetWrapper>
    )
}

export default TODOWidget