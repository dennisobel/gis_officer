import {
    EditOutlined,
    WorkOutlineOutlined,
    EmailOutlined,
    CallOutlined,
    CheckCircleOutlined,
    BusinessCenterOutlined,
    ReportProblemOutlined,
    LocationOnOutlined,
} from "@mui/icons-material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';

import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, forwardRef } from "react";
import { getUsername, getStoreActivity } from "helper/helper";
import { toggleCompliance, toggleReg } from "state";
import { getBuildingById, calculateDistance, verifyBusiness, imageUpload } from "helper/helper";
/**TOAST IMPORTS */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/**IMAGE UPLOAD */
import Dropzone from "react-dropzone";
import axios from "axios";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StoreProfileWidget = ({ store }) => {
    const {
        business_category,
        business_description,
        business_email,
        business_name,
        business_phone,
        payment_status,
        registered,
        store_no,
        escalated
    } = store
    const [allChecked, setAllChecked] = useState(false);
    const [user, setUser] = useState(null);
    const [image, setImage] = useState();
    const { palette } = useTheme();
    const dispatch = useDispatch()
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const [showcompliance, setShowCompliance] = useState(false);
    const [showreg, setShowReg] = useState(false);
    const [coords, setCoords] = useState({})
    const [distance, setDistance] = useState()
    const [minimumdist] = useState(10000)
    const location = useSelector(state => state.currentLocation)
    const [reg, setReg] = useState(registered)
    const [path, setPath] = useState("")
    const [cachedImage, setCachedImage] = useState(null);
    const [activity, setActivity] = useState()
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(['wifi']);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        checkAllItemsChecked();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false)
    };

    const checkAllItemsChecked = () => {
        const allItemsChecked = checked.length === 7; // Change the number based on the total number of list items
        setAllChecked(allItemsChecked);
    };

    const handleVerify = () => {
        verifyBusiness({ store_id: store._id, verified: true }, location)
            .then(({ data }) => {
                setReg("true")
                toast.success(`${data.message}`)
            })
            .then(setOpen(false))
            .catch(({ error }) => {
                toast.error(error.response.data.error)
            })

    };

    useEffect(() => {
        getUsername().then(user => setUser(user))
        getBuildingById({ _id: store.building })
            .then(({ data }) => {
                data && setCoords({ latitude: parseFloat(data?.latitude), longitude: parseFloat(data?.longitude) })
            })
    }, []);

    useEffect(() => {
        getStoreActivity({ type: "", id: store._id })
            .then(({ data }) => {
                setActivity(data)
            })
    }, [])

    useEffect(() => {
        const distance = location && calculateDistance(
            { lat: location?.latitude, lng: location?.longitude },
            { lat: coords?.latitude, lng: coords?.longitude },
        );
        setDistance(distance)
    }, [coords, location])

    useEffect(() => {
        if (distance > minimumdist) {
            dispatch(toggleCompliance(showcompliance))
        } else if (showcompliance) {
            toast.warning("This operation can only be performed on-site, not remote.")
        }
    }, [showcompliance, dispatch, distance, minimumdist])

    useEffect(() => {
        if (distance > minimumdist) {
            dispatch(toggleReg(showreg))
        } else if (showreg) {
            toast.warning("This operation can only be performed on-site, not remote.")
        }
    }, [showreg, dispatch, distance, minimumdist])

    useEffect(() => {
        console.log("image:", image)
        createFormData(image)
    }, [image])

    useEffect(() => {
        getUsername().then((user) => setUser(user));

        // Check if the image data exists in localStorage
        const imageData = localStorage.getItem(`cachedImage-${store_no}`);
        if (imageData) {
            setCachedImage(imageData);
        }
    }, []);

    const createFormData = async (image) => {
        if (image !== undefined || image !== null) {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("category", "building");
            formData.append("store_id", store?._id);
            formData.append("description", `${store.store_no} building`);

            imageUpload(formData, location)
                .then(({ data }) => {
                    const token = localStorage.getItem("token");
                    const headers = { Authorization: `Bearer ${token}` };
                    axios.get(`https://gis.affordit.co.ke${data?.url}`, { responseType: "blob", headers })
                        .then(({ data }) => {
                            const imageUrl = URL.createObjectURL(data);
                            setPath(imageUrl);
                            // Save the image data in localStorage
                            const imageBlob = new Blob([data]);
                            const reader = new FileReader();
                            reader.onload = function () {
                                const imageData = reader.result;
                                localStorage.setItem(`cachedImage-${store_no}`, imageData);
                            };
                            reader.readAsDataURL(imageBlob);
                        })
                        .then(() => toast.success(data?.message))
                        .catch((error) => {
                            console.error("Error fetching image data:", error);
                        });
                })
        }
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{`Verify store # ${store_no}`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Confirm store existence & details.
                        </DialogContentText>
                        <List
                            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        >
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={`Store # - ${store.store_no}`} />
                                <Switch
                                    edge="end"
                                    onChange={handleToggle('store_no')}
                                    checked={checked.indexOf('store_no') !== -1}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={`Application Type - ${store.application_type}`} />
                                <Switch
                                    edge="end"
                                    onChange={handleToggle('application_type')}
                                    checked={checked.indexOf('application_type') !== -1}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={`Branch - ${store.branch_name}`} />
                                <Switch
                                    edge="end"
                                    onChange={handleToggle('branch_name')}
                                    checked={checked.indexOf('branch_name') !== -1}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={`Category - ${store.business_category}`} />
                                <Switch
                                    edge="end"
                                    onChange={handleToggle('business_category')}
                                    checked={checked.indexOf('business_category') !== -1}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={`Floor # - ${store.floor_no}`} />
                                <Switch
                                    edge="end"
                                    onChange={handleToggle('floor_no')}
                                    checked={checked.indexOf('floor_no') !== -1}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={`Address - ${store.postal_address}`} />
                                <Switch
                                    edge="end"
                                    onChange={handleToggle('postal_address')}
                                    checked={checked.indexOf('postal_address') !== -1}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={`Postal Code - ${store.postal_code}`} />
                                <Switch
                                    edge="end"
                                    onChange={handleToggle('postal_code')}
                                    checked={checked.indexOf('postal_code') !== -1}
                                />
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleVerify} disabled={!allChecked}>Agree</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <WidgetWrapper>
                <ToastContainer />
                {/* FIRST ROW */}
                <FlexBetween
                    gap="0.5rem"
                    pb="1.1rem"
                >
                    <FlexBetween gap="1rem">
                        <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            // onDrop={handleImageDrop}
                            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <FlexBetween>
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        width="100%"
                                        sx={{ "&:hover": { cursor: "pointer" } }}
                                    >
                                        <input {...getInputProps()} hidden />
                                        <UserImage image={cachedImage || path} store={store} />

                                    </Box>
                                </FlexBetween>
                            )}

                        </Dropzone>
                        <Box>
                            <Typography
                                variant="h4"
                                color={dark}
                                fontWeight="500"
                                sx={{
                                    "&:hover": {
                                        color: palette.primary.light,
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                {business_name}
                            </Typography>
                            <Typography color={medium}>Store #: {store_no}</Typography>
                        </Box>
                    </FlexBetween>
                </FlexBetween>

                <Box p="1rem 0">
                    <FlexBetween mb="0.5rem">
                        {/* <LocationOnOutlined fontSize="small" sx={{ color: main }} onClick={() => navigate(`/map/${location?.longitude}/${location?.latitude}/${store._id}`)} /> */}
                        <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/${coords.latitude},${coords.longitude}/@${location?.latitude},${location?.longitude},10z/data=!4m10!4m9!1m1!4e1!1m5!1m1!1s0x182f16d5f67653d9:0x13ef638e1bb7a5c5!2m2!1d${location?.longitude}!2d${location?.latitude}!3e0?entry=ttu`}>
                            <LocationOnOutlined fontSize="small" sx={{ color: main }} />
                        </a>
                        <Typography color={main} fontWeight="500">
                            Distance #: {Math.floor(distance)} Ms
                        </Typography>
                    </FlexBetween>
                </Box>

                <Divider />

                {/* SECOND ROW */}
                <Box p="1rem 0">
                    <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                        <Typography color={medium}>{business_category}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap="1rem">
                        <WorkOutlineOutlined fontSize="small" sx={{ color: main }} />
                        <Typography color={medium}>{business_description}</Typography>
                    </Box>
                </Box>

                <Divider />

                {/* THIRD ROW */}
                <Box p="1rem 0">
                    <FlexBetween mb="0.5rem">
                        <EmailOutlined fontSize="small" sx={{ color: main }} />
                        <Typography color={main} fontWeight="500">
                            {business_email}
                        </Typography>
                    </FlexBetween>
                    <FlexBetween>
                        <CallOutlined fontSize="small" sx={{ color: main }} />
                        <Typography color={main} fontWeight="500">
                            {business_phone}
                        </Typography>
                    </FlexBetween>
                </Box>

                <Divider />

                {/* FOURTH ROW */}
                <Box p="1rem 0">
                    <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                        Status Checks
                    </Typography>

                    <FlexBetween gap="1rem">
                        <FlexBetween gap="1rem">
                            <BusinessCenterOutlined fontSize="small" sx={{ color: reg === "true" ? "green" : main }} />
                            <Box>
                                <Typography color={main} fontWeight="500">
                                    Registered
                                </Typography>
                                <Typography color={medium}>{reg === "false" ? "No" : "Yes"}</Typography>
                            </Box>
                        </FlexBetween>
                        {reg === "false" && <EditOutlined sx={{ color: main }} onClick={() => {
                            handleClickOpen()
                        }} />}
                    </FlexBetween>

                    <FlexBetween gap="1rem" mb="0.5rem">
                        <FlexBetween gap="1rem">
                            <CheckCircleOutlined fontSize="small" sx={{ color: payment_status === "Paid" ? "green" : payment_status === "Partially Paid" ? "yellow" : "red" }} />
                            <Box>
                                <Typography color={main} fontWeight="500">
                                    Compliance
                                </Typography>
                                <Typography color={medium}>{payment_status}</Typography>
                            </Box>
                        </FlexBetween>
                        <EditOutlined sx={{ color: main }} onClick={() => setShowCompliance(!showcompliance)} />
                    </FlexBetween>

                    <FlexBetween gap="1rem">
                        <FlexBetween gap="1rem">
                            <ReportProblemOutlined fontSize="small" sx={{ color: escalated ? "red" : "" }} />
                            <Box>
                                <Typography color={main} fontWeight="500">
                                    Escalated : {escalated ? "Yes" : "No"}
                                </Typography>
                            </Box>
                        </FlexBetween>
                    </FlexBetween>
                </Box>
            </WidgetWrapper>
        </>

    );
};

export default StoreProfileWidget;
