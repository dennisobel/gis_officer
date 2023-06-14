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
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUsername, getStoreActivity } from "helper/helper";
import { toggleCompliance, toggleReg } from "state";
import { getBuildingById, calculateDistance, verifyBusiness, imageUpload } from "helper/helper";
/**TOAST IMPORTS */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/**IMAGE UPLOAD */
import Dropzone from "react-dropzone";
import axios from "axios";

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
    } = store
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
    const [activity,setActivity] = useState()

    useEffect(() => {
        getUsername().then(user => setUser(user))
        getBuildingById({ _id: store.building })
            .then(({ data }) => {
                data && setCoords({ latitude: parseFloat(data?.latitude), longitude: parseFloat(data?.longitude) })
            })
    }, []);

    useEffect(() => {
        getStoreActivity({type:"",id:store._id})
        .then(({data}) => {
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
                        <BusinessCenterOutlined fontSize="small" sx={{ color: main }} />
                        <Box>
                            <Typography color={main} fontWeight="500">
                                Registered
                            </Typography>
                            <Typography color={medium}>{reg === "false" ? "No" : "Yes"}</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{ color: main }} onClick={() => {
                        verifyBusiness({ store_id: store._id, verified: true }, location)
                            .then(({ data }) => {
                                setReg("true")
                                toast.success(`${data.message}`)
                            }).catch(err => {
                                toast.error("Something went wrong in verification")
                            })
                    }} />
                </FlexBetween>

                <FlexBetween gap="1rem" mb="0.5rem">
                    <FlexBetween gap="1rem">
                        <CheckCircleOutlined fontSize="small" sx={{ color: main }} />
                        <Box>
                            <Typography color={main} fontWeight="500">
                                Payment Status
                            </Typography>
                            <Typography color={medium}>{payment_status}</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{ color: main }} onClick={() => setShowCompliance(!showcompliance)} />
                </FlexBetween>

                <FlexBetween gap="1rem">
                    <FlexBetween gap="1rem">
                        <ReportProblemOutlined fontSize="small" sx={{ color: "red" }} />
                        <Box>
                            <Typography color={main} fontWeight="700">
                                Escalated
                            </Typography>
                        </Box>
                    </FlexBetween>
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    );
};

export default StoreProfileWidget;
