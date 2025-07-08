// src/components/UpcomingDeadlines.jsx
import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, useTheme, Box, Divider } from '@mui/material';
import { tokens } from '../theme';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {orange,red}from '@mui/material/colors';

// بيانات وهمية للعرض
const mockDeadlines = [
    { id: 1, task: 'Finalize architectural blueprints', project: 'Project Alpha', daysLeft: 2 },
    { id: 2, task: 'Submit plumbing permits', project: 'Project Beta', daysLeft: 4 },
    { id: 3, task: 'On-site concrete inspection', project: 'Project Gamma', daysLeft: 5 },
    { id: 4, task: 'Client review meeting', project: 'Project Alpha', daysLeft: 7 },
];

const UpcomingDeadlines = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Paper sx={{ p: 2, backgroundColor: colors.primary[700], borderRadius: '12px', height: '100%' }}>
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                Upcoming Deadlines
            </Typography>
            <List>
                {mockDeadlines.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: colors.blueAccent[600] }}>
                                    <CalendarTodayIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography color={colors.grey[100]}>{item.task}</Typography>
                                }
                                secondary={
                                    <Box component="span" display="flex" justifyContent="space-between" width="100%">
                                        <Typography variant="body2" component="span" color={colors.grey[400]}>
                                            {item.project}
                                        </Typography>
                                        <Typography variant="body2" component="span" fontWeight="bold" color={item.daysLeft < 4 ? red : orange}>
                                            {item.daysLeft} days left
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                        {index < mockDeadlines.length - 1 && <Divider variant="inset" component="li" sx={{ borderColor: colors.grey[800] }} />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

export default UpcomingDeadlines;