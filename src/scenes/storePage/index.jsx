import { Box, useMediaQuery, IconButton } from "@mui/material";
import { ArrowBackOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import StoreProfileWidget from "scenes/widgets/StoreProfileWidget";
import ComplianceWidget from "scenes/widgets/ComplianceWidget";
import VerifyRegistrationWidget from "scenes/widgets/VerifyRegistrationWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { getUsername } from "helper/helper";
import { useState, useEffect } from "react";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { getBusinessById } from "helper/helper";
/**CHART IMPORTS */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { faker } from "@faker-js/faker";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
);

export const lineoptions = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Payment History',
        },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const linelabels = ['Jan', 'Feb', 'March', 'Apr', 'May'];

export const linedata = {
    labels: linelabels,
    datasets: [
        {
            label: 'Collected',
            data: linelabels.map(() => faker.number.int({ min: 0, max: 1000 })),
            borderColor: 'rgb(0, 255, 0)',
            backgroundColor: 'rgba(255, 165, 0, 0.5)',
            yAxisID: 'y',
        },
        {
            label: 'Balance',
            data: linelabels.map(() => faker.number.int({ min: 0, max: 1000 })),
            borderColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgba(255, 165, 0, 0.5)',
            yAxisID: 'y1',
        },
    ],
};

const StorePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const togglecompliance = useSelector(state => state.togglecompliance);
    const togglereg = useSelector(state => state.togglereg);
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const { storeId } = useParams();
    const [store, setStore] = useState()

    const getStore = async () => {
        const { data } = await getBusinessById(storeId)
        console.log("STORE:", data)
        setStore(data)
    }

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
        getStore()
    }, [])

    return (
        <Box>
            <FlexBetween gap="1.5rem">
                <IconButton onClick={() => navigate("/stores")}>
                    <ArrowBackOutlined />
                </IconButton>
            </FlexBetween>
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    {store !== undefined && <StoreProfileWidget userId={user?.msisdn} picturePath={""} store={store} />}
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    {togglecompliance && <ComplianceWidget picturePath={""} />}
                </Box>

                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    {togglereg && <VerifyRegistrationWidget picturePath={""} />}
                </Box>
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <Box p="1rem 0">
                        <Line options={lineoptions} data={linedata} />;
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default StorePage;