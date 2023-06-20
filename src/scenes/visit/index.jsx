import { Box, useMediaQuery, Typography, Divider, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import TODOWidget from "scenes/widgets/TODOWidget";
import { useState, useEffect } from "react";
/**DATE PICKER LIBS */
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import WidgetWrapper from "components/WidgetWrapper";

const VisitPage = () => {
    const TODO = useSelector(state => state.TODO)
    const doneTODO = useSelector(state => state.doneTODO)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [visitdate, setDate] = useState()
    const [filteredTODO, setFiltered] = useState([])

    useEffect(() => {
        if (visitdate !== undefined) {
            let filtered = TODO.filter(store => {
                return store.visitdate === dayjs(visitdate).format("DD-MM-YYYY")
            })

            if (filtered.length !== 0) {
                setFiltered(filtered)
            } else {
                /**ADD TOAST FOR NO ITEM FOUND */
                setFiltered(TODO)
            }
        }
    }, [visitdate, TODO])

    const todos = visitdate ? filteredTODO : TODO;

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="0.2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.2rem"
                justifyContent="space-between"
            >
                <WidgetWrapper style={{ display: 'flex', justifyContent: 'center' }} m="1rem 0">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Filter visit plan by date"
                            value={visitdate}
                            onChange={(newValue) => setDate(newValue)}
                            onAccept={""}
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    InputProps={{
                                        ...props.InputProps,
                                        classes: { notchedOutline: 'no-border' },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </WidgetWrapper>
                <Box p="1rem 0">
                    <Typography fontSize="1rem" fontWeight="500" mb="1rem">
                        To Visit
                    </Typography>
                </Box>
                <Box padding="0.2rem 6%" gap="0.3rem" flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    {todos.map(store => (
                        <TODOWidget
                            key={store._id}
                            branch={store.branch_name}
                            category={store.business_category}
                            description={store.business_description}
                            email={store.business_email}
                            phone={store.business_phone}
                            paymentstatus={store.payment_status}
                            store_no={store.store_no}
                            store={store}
                        />
                    ))}
                </Box>
                <Divider />
                <Box p="1rem 0">
                    <Typography fontSize="1rem" fontWeight="500" mb="1rem">
                        Visited
                    </Typography>
                </Box>
                <Box padding="0.2rem 6%" gap="0.3rem" flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    {doneTODO.map(store => (
                        <TODOWidget
                            key={store._id}
                            branch={store.branch_name}
                            category={store.business_category}
                            description={store.business_description}
                            email={store.business_email}
                            phone={store.business_phone}
                            paymentstatus={store.payment_status}
                            store_no={store.store_no}
                            store={store}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default VisitPage