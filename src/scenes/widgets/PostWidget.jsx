import {
  VisibilityOutlined,
  LocationCitySharp,
  DescriptionSharp,
  AddRoadSharp
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStores } from "state";
import { getAllBuildingStores } from "helper/helper";
import { TailSpin } from "react-loader-spinner";
import { useState } from "react";

const PostWidget = ({
  building_number,
  floors,
  type_of_structure,
  street,
  description,
  payment_status,
  id
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    getAllBuildingStores({ _id: id })
      .then(({ data }) => {
        dispatch(setStores(data))
      })
      .then(setIsLoading(false))
      .then(navigate("/stores"))
  }


  return (
    <>
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
      <WidgetWrapper m="2rem 0" >
        <FlexBetween gap="0.3rem">
        <IconButton onClick={handleClick}>
            <LocationCitySharp />
          </IconButton>
          <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            Building # {building_number}
          </Typography>
          <IconButton onClick={handleClick}>
            <VisibilityOutlined />
          </IconButton>
        </FlexBetween>
        <FlexBetween gap="0.3rem">
          <IconButton>
            <DescriptionSharp />
          </IconButton>
          <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            {description}
          </Typography>
        </FlexBetween>
        <FlexBetween mt="0.3rem">
              <IconButton>
                <AddRoadSharp />
              </IconButton>
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {street}
              </Typography>
        </FlexBetween>
        <Box>
          <Divider />
          <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
            {type_of_structure} - {payment_status}
          </Typography>
        </Box>
      </WidgetWrapper>
    </>
  );
};

export default PostWidget;
