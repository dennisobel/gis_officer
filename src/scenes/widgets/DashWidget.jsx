import { ManageAccountsOutlined, LocationOnOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { getUsername, getSummaries, getUserActivity } from "helper/helper";
import dayjs from 'dayjs';

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

const DashWidget = ({ userId }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const [summary, setSummary] = useState();
  const [activity, setUserActivity] = useState()
  const [visits, setVisits] = useState(0)

  //CHARTS
  const labels = ['March', 'April', 'May'];
  const payment_history_labels = ['May'];
  const target_number = summary?.monthly_target;
  const paidData = [summary?.monthly_ward_paid];

  const payment_history_options = {
    plugins: {
      title: {
        display: true,
        text: "Payment History",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const payment_history_data = {
    labels: payment_history_labels,
    datasets: [
      {
        label: 'Collected',
        data: paidData,
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
      },
      {
        label: 'Target',
        data: paidData.map((paid) => target_number - paid),
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Payment Status",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const payment_status_data = [
    {
      month: "March",
      p: 20,
      pp: 45,
      np: 25
    },
    {
      month: "April",
      p: 40,
      pp: 15,
      np: 30
    },
    {
      month: "May",
      p: 25,
      pp: 20,
      np: 50
    }
  ]

  /**REPLACE WITH ACTUAL DATA */
  const dashlabels = payment_status_data.map(obj => obj.month)
  const p = payment_status_data.map(obj => obj.p)
  const pp = payment_status_data.map(obj => obj.pp)
  const np = payment_status_data.map(obj => obj.np)

  const data = {
    labels: dashlabels,
    datasets: [
      {
        label: 'P',
        data: p,
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
      },
      {
        label: 'PP',
        data: pp,
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
      },
      {
        label: 'NP',
        data: np,
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
    ],
  };
  //EOF CHARTS

  useEffect(() => {
    getUsername().then(user => setUser(user))
    getSummaries().then(res => setSummary(res?.data.summary))
    getUserActivity({ type: "" }).then(({ data }) => setUserActivity(data))
  }, []);

  useEffect(() => {
    let count = activity !== undefined && activity.filter(el => el.type === "store_checkin").length
    setVisits(count)
  }, [activity])

  if (!user) {
    return null;
  }

  const {
    name,
    msisdn,
  } = user;

  return (
    <>
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
        // onClick={() => navigate(`/profile/${userId}`)}
        >
          <FlexBetween gap="1rem">
            <UserImage image={""} />
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
                {name}
              </Typography>
              <Typography color={medium}>{msisdn}</Typography>
            </Box>
          </FlexBetween>
          {/* <ManageAccountsOutlined /> */}
        </FlexBetween>

        <Divider />

        {/* SECOND ROW */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{user.ward}</Typography>
          </Box>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Visits Count</Typography>
            <Typography color={main} fontWeight="500">{visits}</Typography>
          </FlexBetween>
        </Box>

        <Divider />

        {/* THIRD ROW */}
        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Payment Status Summary
          </Typography>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Paid</Typography>
            <Typography color={main} fontWeight="500">
              {payment_status_data[2].p} ({
                ((payment_status_data[2].p / (
                  payment_status_data[2].p + payment_status_data[2].pp + payment_status_data[2].np
                )) * 100).toFixed(2)
              }%)
            </Typography>
          </FlexBetween>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Not Paid</Typography>
            <Typography color={main} fontWeight="500">
              {payment_status_data[2].np} ({
                ((payment_status_data[2].np / (
                  payment_status_data[2].p + payment_status_data[2].pp + payment_status_data[2].np
                )) * 100).toFixed(2)
              }%)
            </Typography>
          </FlexBetween>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Partially Paid</Typography>
            <Typography color={main} fontWeight="500">
              {payment_status_data[2].pp} ({
                ((payment_status_data[2].pp / (
                  payment_status_data[2].p + payment_status_data[2].pp + payment_status_data[2].np
                )) * 100).toFixed(2)
              }%)
            </Typography>
          </FlexBetween>
        </Box>
      </WidgetWrapper>
      <br />
      <Box p="1rem 0">
        <Bar options={options} data={data} />
      </Box>
      <br />
      <WidgetWrapper>
        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Revenue Summary
          </Typography>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Total Collected</Typography>
            <Typography color={main} fontWeight="500">
              {summary?.monthly_ward_paid} ({
                ((summary?.monthly_ward_paid / (
                  summary?.monthly_ward_paid + summary?.monthly_ward_balance
                )) * 100).toFixed(2)
              }%)
            </Typography>
          </FlexBetween>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Balance</Typography>
            <Typography color={main} fontWeight="500">
              {summary?.monthly_ward_balance} ({
                ((summary?.monthly_ward_balance / (
                  summary?.monthly_ward_paid + summary?.monthly_ward_balance
                )) * 100).toFixed(2)
              }%)
            </Typography>
          </FlexBetween>
        </Box>
      </WidgetWrapper>
      <br />
      <Box p="1rem 0">
        <Bar options={payment_history_options} data={payment_history_data} />
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
    </>
  );
};

export default DashWidget;
