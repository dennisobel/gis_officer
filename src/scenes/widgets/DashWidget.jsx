import {
  ManageAccountsOutlined,
  VisibilityOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";

import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

import { Box, Typography, Divider, useTheme, Badge } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsername } from "helper/helper";

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

const linelabels = ['Jan','Feb','March', 'Apr', 'May'];

export const linedata = {
  labels:linelabels,
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

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Last 3 Months' Payment Status",
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

const labels = ['March', 'April', 'May'];

export const data = {
  labels,
  datasets: [
    {
      label: 'P',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(0, 255, 0, 0.5)',
    },
    {
      label: 'PP',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 165, 0, 0.5)',
    },
    {
      label: 'NP',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },
  ],
};

const steps = [
  {
    label: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Create an ad group',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

const DashWidget = ({ userId }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const theme = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
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

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    getUsername().then(user => setUser(user))
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    name,
    email,
    id_number,
    msisdn,
    role,
    ministry,
  } = user;

  return (
    <>
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
          onClick={() => navigate(`/profile/${userId}`)}
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
              <Typography color={medium}>{msisdn} ID</Typography>
            </Box>
          </FlexBetween>
          <ManageAccountsOutlined />
        </FlexBetween>

        <Divider />

        {/* SECOND ROW */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{user.ward}</Typography>
          </Box>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Visits Last Month</Typography>
            <Typography color={main} fontWeight="500">95 (-2%)</Typography>
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
              25 (-12%)
            </Typography>
          </FlexBetween>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Not Paid</Typography>
            <Typography color={main} fontWeight="500">
              25 (+23%)
            </Typography>
          </FlexBetween>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Partially Paid</Typography>
            <Typography color={main} fontWeight="500">
              45 (-2%)
            </Typography>
          </FlexBetween>
        </Box>
      </WidgetWrapper>
      <br/>
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
              250000 (-12%)
            </Typography>
          </FlexBetween>
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Balance</Typography>
            <Typography color={main} fontWeight="500">
              25000 (+23%)
            </Typography>
          </FlexBetween>
        </Box>
      </WidgetWrapper>
      <br />
      <Box p="1rem 0">
      <Line options={lineoptions} data={linedata} />;
      </Box>
      <WidgetWrapper>
        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Missed Store Visits {" "}
            <Badge badgeContent={4} color="primary">
              <WorkOutlineOutlined color="action" />
            </Badge>
          </Typography>

          <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
            <Paper
              square
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 50,
                pl: 2,
                bgcolor: 'background.default',
              }}
            >
              <Typography>Store #</Typography>
            </Paper>

            <ListItem
              key={steps[activeStep].label}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  <VisibilityOutlined />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleToggle(steps[activeStep].label)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(steps[activeStep].label) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': " " }}
                  />
                </ListItemIcon>
                <ListItemText id={""} primary={`Status: Partially paid`} />
              </ListItemButton>
            </ListItem>
            <MobileStepper
              variant="text"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </Box>
        </Box>
      </WidgetWrapper>
    </>
  );
};

export default DashWidget;
