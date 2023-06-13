import {
  LocationOnOutlined,
  VisibilityOutlined
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStores } from "state";
import { getAllBuildingStores } from "helper/helper";

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

  const handleClick = () => {
    getAllBuildingStores({_id:id}).then(({data}) => {
      dispatch(setStores(data))
    }).then(navigate("/stores"))
  }


  return (
    <WidgetWrapper m="2rem 0" >
      <FlexBetween gap="0.3rem">
        <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
          Building # {building_number}
        </Typography>
      </FlexBetween>
      <FlexBetween gap="0.3rem">
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      </FlexBetween>
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => navigate("/map")}>
              <LocationOnOutlined />
            </IconButton>
            <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
              {street}
            </Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <Typography>Floors # {floors}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton onClick={handleClick}>
          <VisibilityOutlined />
        </IconButton>
      </FlexBetween>
      <Box>
        <Divider />
        <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
          {type_of_structure} - {payment_status}
        </Typography>
      </Box>
    </WidgetWrapper>
  );
};

export default PostWidget;
