import { LocationOnOutlined } from "@mui/icons-material";
import {
    Box,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox
} from "@mui/material";

import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";


const TODOWidget = ({store}) => {
    const [checked, setChecked] = useState([0]);

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