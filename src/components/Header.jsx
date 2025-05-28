import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";  

export const Header = ({title, subtitle})=>{
const  theme=useTheme();
const colors=tokens(theme.palette.mode);
return (

    <Box >
        <Typography variant="h3" mb="5px" ml="10px" color={colors.grey[100]} fontWeight={"bold"}>
            {title}
        </Typography>
        <Typography variant="h6" margin="0px 10px 10px 10px" color={colors.greenAccent[400]}>{subtitle}</Typography>
    </Box>
);
}