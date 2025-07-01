import { tokens } from "../theme"; // Make sure the path to your theme is correct
import React from 'react';
import { Box, Typography, Paper, useTheme, Avatar } from "@mui/material";

const DetailItem = ({ icon, label, children }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Paper
            sx={{
                p: 2, // Increased padding slightly for more breathing room
                display: "flex",
                alignItems: "center",
                gap: 2,
                // --- A subtle gradient background adds depth ---
                background: `linear-gradient(135deg, ${colors.primary[700]}, ${colors.primary[800]})`,
                border: `1px solid ${colors.grey[800]}`, // Softer initial border
                borderRadius: '12px', // Slightly more rounded corners
                // --- Smoother and more comprehensive transition ---
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                
                // --- Enhanced Hover Effect ---
                '&:hover': {
                    transform: 'translateY(-5px) scale(1.02)', // A bit more pronounced lift and scale
                    borderColor: colors.greenAccent[500],
                    // --- A softer, more layered shadow for a professional glow ---
                    boxShadow: `
                        0px 10px 20px -5px ${colors.primary[900]},
                        0px 0px 15px -5px ${colors.greenAccent[700]}
                    `,
                    // --- Make the icon itself react on hover ---
                    '& .MuiAvatar-root': {
                        transform: 'scale(1.1)',
                        backgroundColor: colors.greenAccent[600],
                    },
                    '& .MuiSvgIcon-root': {
                        color: colors.grey[100],
                    }
                }
            }}
        >
            {/* --- Icon wrapped in an Avatar for better presentation --- */}
            <Avatar 
                sx={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: colors.primary[900], 
                    color: colors.greenAccent[300],
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                    border: `1px solid ${colors.grey[700]}`
                }}
            >
                {icon}
            </Avatar>

            <Box>
                <Typography variant="body1" color={colors.grey[400]} sx={{ letterSpacing: '0.5px' }}>
                    {label}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
                    {children}
                </Typography>
            </Box>
        </Paper>
    );
};

export default DetailItem;