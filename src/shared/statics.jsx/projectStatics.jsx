import { tokens } from "../../theme";
import {
    useTheme,

  } from "@mui/material";


export const statusOfSaleOptions = [ "NotForSale","ForSale"];
export const projectTypeOptions = ["Residential", "Commercial"];
export const progressStatusOptions = ["Initial", "In Progress","Done"];



// export const getProgressChipStyle = (progress) => {
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);
//     // Similar styling logic for progress chip
//     const baseStyle = {
//         color: colors.grey[100],
//         fontWeight: "bold",
//         fontSize: "1rem",
//         borderRadius: "12px",
//         py: 1.5,
//         px: 2.5,
//     };
//     switch (progress) {
//         case "Completed": return { ...baseStyle, backgroundColor: '#2e7d32' }; // Darker Green
//         case "In Progress": return { ...baseStyle, backgroundColor: colors.blueAccent[500] };
//         case "Not Started": return { ...baseStyle, backgroundColor: colors.grey[600] };
//         case "On Hold": return { ...baseStyle, backgroundColor: '#f9a825' }; // Darker Yellow
//         case "Cancelled": return { ...baseStyle, backgroundColor: colors.redAccent[500] };
//         default: return { ...baseStyle, backgroundColor: colors.grey[700] };
//     }
// };