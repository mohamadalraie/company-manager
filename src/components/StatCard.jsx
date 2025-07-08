// src/components/StatCard.jsx
import React from 'react';
import { Paper, Stack, Typography, Avatar, useTheme } from '@mui/material';
import { tokens } from '../theme';

const StatCard = ({ title, value, icon, color }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Paper
            sx={{
                p: 2.5,
                backgroundColor: colors.primary[700],
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <Avatar
                sx={{
                    backgroundColor: color || colors.greenAccent[600],
                    width: 56,
                    height: 56,
                }}
            >
                {icon}
            </Avatar>
            <Stack>
                <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                    {value}
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                    {title}
                </Typography>
            </Stack>
        </Paper>
    );
};

export default StatCard;