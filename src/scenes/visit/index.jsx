import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import TODOWidget from "scenes/widgets/TODOWidget";
import { getUsername } from "helper/helper";
import { useState, useEffect } from "react";
/**DATE PICKER LIBS */
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const VisitPage = () => {
    const TODO = useSelector(state => state.TODO)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [user, setUser] = useState()
    const [visitdate, setDate] = useState()
    const [filteredTODO,setFiltered] = useState([])

    useEffect(() => {
        console.log(" TODO:", TODO)
        getUsername()
            .then(user => setUser(user))
    }, [])

    useEffect(() => {
        if(visitdate !== undefined) {
            let filtered = TODO.filter(store => {
                return store.visitdate === dayjs(visitdate).format("DD-MM-YYYY")
            })

            console.log(" filtered",filtered)

            if(filtered.length !== 0) {
                setFiltered(filtered)
            } else {
                /**ADD TOAST FOR NO ITEM FOUND */
                setFiltered(TODO)
            }
        }
    },[visitdate,TODO])

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
                <WidgetWrapper>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker label="Filter visit plan by date" value={visitdate} onChange={(newValue) => setDate(newValue)} onAccept={""} />
                    </LocalizationProvider>
                </WidgetWrapper>
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
            </Box>
        </Box>
    )
}

export default VisitPage