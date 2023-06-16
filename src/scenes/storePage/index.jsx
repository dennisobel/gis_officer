import { Box, useMediaQuery, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowBackOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import StoreProfileWidget from "scenes/widgets/StoreProfileWidget";
import ComplianceWidget from "scenes/widgets/ComplianceWidget";
import VerifyRegistrationWidget from "scenes/widgets/VerifyRegistrationWidget";
import { getUsername, getStoreTransactions } from "helper/helper";
import { useState, useEffect } from "react";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { getBusinessById, getStoreActivity } from "helper/helper";
import { TailSpin } from "react-loader-spinner";
import dayjs from 'dayjs';
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

import { Line } from 'react-chartjs-2';

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

const StorePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const togglecompliance = useSelector(state => state.togglecompliance);
    const togglereg = useSelector(state => state.togglereg);
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const { storeId } = useParams();
    const [store, setStore] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [activity, setActivity] = useState()
    const [transactions, setTransactions] = useState()
    const { palette } = useTheme();
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const lineoptions = {
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
                min: 0,
                max: 200,
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


    const linelabels = transactions?.map(obj => dayjs(obj.date).format('MMM'));
    const collectedData = transactions?.map(obj => obj.transactions_sum);
    const balanceData = transactions?.map(obj => obj.balance);

    const linedata = {
        labels: linelabels,
        datasets: [
            {
                label: 'Collected',
                data: collectedData,
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgba(255, 165, 0, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Balance',
                data: balanceData,
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgba(255, 165, 0, 0.5)',
                yAxisID: 'y1',
            },
        ],
    };

    const getStore = async () => {
        setIsLoading(true);
        const { data } = await getBusinessById(storeId)
        setIsLoading(false)
        setStore(data)
    }

    useEffect(() => {
        getStoreActivity({ type: "", id: storeId })
            .then(({ data }) => {
                setActivity(data)
            })
        getStoreTransactions({ id: storeId }).then(({ data }) => {
            setTransactions(data)
        })

    }, [])

    useEffect(() => {
        getUsername()
            .then(user => setUser(user))
        getStore()
    }, [])

    return (
        <>
            <WidgetWrapper>
                <FlexBetween gap="0.1rem">
                    <IconButton onClick={() => navigate("/stores")}>
                        <ArrowBackOutlined />
                    </IconButton>
                    <Typography fontSize="0.8rem" color={main} fontWeight="500" mb="0.5rem">
                        {store?.business_name}
                    </Typography>
                </FlexBetween>
            </WidgetWrapper>

            <Box>
                {isLoading && <TailSpin
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />}
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
                        {togglecompliance && <ComplianceWidget store={store} picturePath={""} />}
                    </Box>

                    <Box
                        flexBasis={isNonMobileScreens ? "42%" : undefined}
                        mt={isNonMobileScreens ? undefined : "2rem"}
                    >
                        {togglereg && <VerifyRegistrationWidget picturePath={""} />}
                    </Box>
                    <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                        <Box p="1rem 0">
                            <Line options={lineoptions} data={linedata} />
                        </Box>
                    </Box>

                    <WidgetWrapper>
                        <Box p="1rem 0">
                            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                                Activity Log
                            </Typography>
                            <FlexBetween mb="0.5rem">
                                <Typography color={main} fontWeight="400">Activity</Typography>
                                <Typography color={main} fontWeight="400">
                                    Store
                                </Typography>
                                <Typography color={main} fontWeight="400">
                                    Date
                                </Typography>
                            </FlexBetween>
                            {activity?.map(el => (
                                <FlexBetween mb="0.5rem">
                                    <Typography fontSize="small" color={medium}>{el.type}</Typography>
                                    <Typography fontSize="small" color={medium} fontWeight="400">
                                        {el?.store?.store_no}
                                    </Typography>
                                    <Typography fontSize="small" color={medium} fontWeight="400">
                                        {dayjs(el?.created_at).format("DD/MM/YY")}
                                    </Typography>
                                </FlexBetween>
                            ))}
                        </Box>
                    </WidgetWrapper>
                </Box>
            </Box>
        </>
    )
}

export default StorePage;