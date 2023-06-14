import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px", store }) => {  
  const defaultImageSrc =
    "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png";

  // const src = image !== "" ?  URL.createObjectURL(image) : defaultImageSrc;
  const src = image !== "" ?  image : defaultImageSrc;

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={src}
      />
    </Box>
  );
};

export default UserImage;
