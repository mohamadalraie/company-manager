// src/components/BudgetPerformanceChart.jsx
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Paper, Typography, useTheme } from '@mui/material';
import { tokens } from '../theme';

// بيانات وهمية للعرض
const mockBudgetData = [
    { project: 'Project Alpha', "Expected Cost": 200000, "Actual Cost": 185000 },
    { project: 'Project Beta', "Expected Cost": 350000, "Actual Cost": 365000 },
    { project: 'Project Gamma', "Expected Cost": 270000, "Actual Cost": 275000 },
    { project: 'Project Delta', "Expected Cost": 500000, "Actual Cost": 450000 },
    { project: 'Project Epsilon', "Expected Cost": 150000, "Actual Cost": 130000 },
];

const BudgetPerformanceChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Paper sx={{ p: 2, backgroundColor: colors.primary[700], borderRadius: '12px', height: '400px' }}>
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={1}>
                Budget vs. Actual Cost
            </Typography>
            <ResponsiveBar
                data={mockBudgetData}
                keys={['Expected Cost', 'Actual Cost']}
                indexBy="project"
                margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={[colors.blueAccent[300], colors.greenAccent[500]]}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Projects',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    truncateTickAt: 0
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cost (USD)',
                    legendPosition: 'middle',
                    legendOffset: -50,
                    truncateTickAt: 0,
                    format: value => `$${(value / 1000)}k` // Format y-axis ticks
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                    }
                ]}
                theme={{
                    axis: {
                        ticks: { text: { fill: colors.grey[300] } },
                        legend: { text: { fill: colors.grey[300] } },
                    },
                    legends: { text: { fill: colors.grey[200] } },
                    tooltip: {
                        container: {
                            background: colors.primary[600],
                            color: colors.grey[100],
                        },
                    },
                }}
            />
        </Paper>
    );
};

export default BudgetPerformanceChart;