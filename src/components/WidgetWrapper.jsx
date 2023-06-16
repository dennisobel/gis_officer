import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: "#ffffff",
  borderRadius: "0.25rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
}));

export default WidgetWrapper;
