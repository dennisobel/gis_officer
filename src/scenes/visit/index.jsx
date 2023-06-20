import { Box, useMediaQuery, Typography, Divider, TextField, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import TODOWidget from "scenes/widgets/TODOWidget";
import { useState, useEffect } from "react";
import { LocationOnOutlined } from "@mui/icons-material";
/**DATE PICKER LIBS */
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import WidgetWrapper from "components/WidgetWrapper";
import { getBuildingById } from "helper/helper";

const VisitPage = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const TODO = useSelector(state => state.TODO)
    const doneTODO = useSelector(state => state.doneTODO)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [visitdate, setDate] = useState()
    const [addCoords, setAddCoords] = useState([])
    const [filteredTODO, setFiltered] = useState([])
    const [mapurl, setMapUrl] = useState()
    const location = useSelector(state => state.currentLocation)

    useEffect(() => {
        let todos = []
        TODO.forEach(store => {
            let todo
            getBuildingById({ _id: store?.building })
                .then(({ data }) => {
                    todo = { ...store, coords: { latitude: parseFloat(data?.latitude), longitude: parseFloat(data?.longitude) } }
                    todos.push(todo)
                    return todos
                })
                .then(res => {
                    setAddCoords([...res])
                })
        })
    }, [])

    useEffect(() => {
        // const waypointscoords = addCoords.map(el => {
        //     return `${el.coords.latitude},${el.coords.longitude},`
        // })
        const origin = addCoords[0]?.coords;
        const destination = addCoords[addCoords.length - 1]?.coords;


        const intermediateWaypoints = addCoords.slice(1, addCoords.length - 1);
        // const intermediateWaypoints = waypoints.slice(1, waypoints.length - 1);
        const waypointCoordinates = intermediateWaypoints.length > 0 ? intermediateWaypoints.map(el => `${el?.coords?.latitude},${el?.coords?.longitude}`).join('|') : '';


        // const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${origin?.latitude},${origin?.longitude}&destination=${destination?.latitude},${destination?.longitude}&travelmode=driving&waypoints=${waypointCoordinates.join('|')}`;
        const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${origin?.latitude},${origin?.longitude}&destination=${destination?.latitude},${destination?.longitude}&travelmode=driving${waypointCoordinates ? `&waypoints=${waypointCoordinates}` : ''}`;
        setMapUrl(googleMapsURL)

        console.log("googleMapsURL:", googleMapsURL)
        if (visitdate !== undefined) {
            let filtered = addCoords.filter(store => {
                return store.visitdate === dayjs(visitdate).format("DD-MM-YYYY")
            })

            if (filtered.length !== 0) {
                setFiltered(filtered)
            } else {
                /**ADD TOAST FOR NO ITEM FOUND */
                setFiltered(addCoords)
            }
        }
    }, [visitdate, addCoords])

    const todos = visitdate ? filteredTODO : addCoords;

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
                    <Box display="flex" alignItems="center" gap="1rem">
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
                        {/* <LocationOnOutlined fontSize="medium" sx={{ color: main }} /> */}
                        <a target="_blank" rel="noreferrer" href={mapurl}>
                            <LocationOnOutlined fontSize="small" sx={{ color: main }} />
                        </a>
                    </Box>
                </WidgetWrapper>
                <Box p="0.2rem 0">
                    <Typography fontSize="0.8rem" fontWeight="500" mb="1rem">
                        To Visit
                    </Typography>
                </Box>
                <Box padding="0.2rem 4%" gap="0.2rem" flexBasis={isNonMobileScreens ? "26%" : undefined}>
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
                <Box p="0.2rem 0">
                    <Typography fontSize="0.8rem" fontWeight="500" mb="1rem">
                        Visited
                    </Typography>
                </Box>
                <Box padding="0.2rem 4%" gap="0.2rem" flexBasis={isNonMobileScreens ? "26%" : undefined}>
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