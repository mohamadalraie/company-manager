// src/components/cards/SaleCard.jsx

import React from "react";
import {
  Box, Typography, useTheme, Card, CardContent, 
  Chip, CardMedia, CardActionArea, Stack
} from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { tokens } from "../theme";

const SaleCard = ({ sale, onClick }) => {
  const colors = tokens(useTheme().palette.mode);

  // استخدام Optional Chaining (?.) وقيم احتياطية لمنع الأخطاء
  const mainTitle = sale?.main_title || "Untitled Project";
  const address = sale?.address || sale?.project?.location || "No address";
  const mainImage = sale?.main_image || "https://via.placeholder.com/340x220.png?text=Image+Not+Available";
  const status = sale?.status_of_sale || "N/A";
  const type = sale?.type || "N/A";
  const area = sale?.area || "N/A";

  return (
    <Card
      sx={{
        width: 340,
        flexShrink: 0,
        backgroundColor: colors.primary[700],
        borderRadius: "12px",
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: `0px 10px 20px -5px ${colors.greenAccent[900]}`
        }
      }}
    >
      <CardActionArea onClick={onClick}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia component="img" height="200" image={mainImage} alt={mainTitle} />
          <Chip 
            label={status}
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, backgroundColor: colors.greenAccent[600], color: 'white', fontWeight: 'bold' }}
          />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" fontWeight="bold" noWrap>{mainTitle}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{address}</Typography>
          <Stack direction="row" spacing={2} mt={2} color={colors.grey[300]}>
             <Box display="flex" alignItems="center" gap={0.5}><HomeWorkIcon fontSize="small"/> <Typography variant="caption">{type}</Typography></Box>
             <Box display="flex" alignItems="center" gap={0.5}><SquareFootIcon fontSize="small"/> <Typography variant="caption">{area} m²</Typography></Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SaleCard;