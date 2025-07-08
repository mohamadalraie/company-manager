// src/components/ProjectsStatusPie.jsx
import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Paper, Typography, useTheme ,Box} from '@mui/material';
import { tokens } from '../theme';

// بيانات وهمية للعرض، يمكنك استبدالها ببيانات حقيقية
const mockPieData = [
    { id: 'In Progress', label: 'In Progress', value: 12 },
    { id: 'Done', label: 'Done', value: 8 },
    { id: 'Initial', label: 'Initial', value: 5 },
];

const ProjectsStatusPie = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // تعريف ألوان مخصصة للحالات المختلفة
    const colorMapping = {
        'In Progress': colors.blueAccent[500],
        'Done': colors.greenAccent[500],
        'Initial': colors.grey[500],
    };

    return (
        <Paper sx={{ p: 2, backgroundColor: colors.primary[700], borderRadius: '12px', height: '100%' }}>
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={1}>
                Projects Status
            </Typography>
            <Box height="250px"> {/* تحديد ارتفاع ثابت للمخطط */}
                <ResponsivePie
                    data={mockPieData}
                    theme={{
                        tooltip: {
                            container: {
                                background: colors.primary[600],
                                color: colors.grey[100],
                            },
                        },
                        legends: {
                            text: {
                                fill: colors.grey[100],
                            },
                        },
                    }}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor={colors.grey[100]}
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    colors={({ id }) => colorMapping[id] || colors.grey[700]} // استخدام الألوان المخصصة
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle',
                        },
                    ]}
                />
            </Box>
        </Paper>
    );
};

export default ProjectsStatusPie;