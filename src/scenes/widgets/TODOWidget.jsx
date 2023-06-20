import { LocationOnOutlined } from "@mui/icons-material";
import {
    Box,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from "@mui/material";

import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDoneTODO } from "state";

const TODOWidget = ({ store }) => {
    const [checked, setChecked] = useState([0]);
    const dispatch = useDispatch()
    const TODO = useSelector((state) => state.TODO);
    const doneTODO = useSelector((state) => state.doneTODO);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);

        const updatedTODO = TODO.filter((todo) => todo._id !== value);
        const updatedDoneTODO = newChecked.includes(value)
            ? [...doneTODO, store]
            : doneTODO;

        dispatch(
            setDoneTODO({
                updatedTODO: updatedTODO,
                updatedDoneTODO: updatedDoneTODO,
            })
        );
    };

    return (
        <WidgetWrapper m="0.4rem 0">
            <Box p="0.1rem 0">
                <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                    <ListItem
                        key={store._id}
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