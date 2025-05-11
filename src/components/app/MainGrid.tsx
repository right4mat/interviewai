'use client';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChartUserByCountry from '@/components/app/ChartUserByCountry';
import CustomizedTreeView from '@/components/shared/CustomizedTreeView';
import CustomizedDataGrid from '@/components/shared/CustomizedDataGrid';
import HighlightedCard from '@/components/app/HighlightedCard';
import PageViewsBarChart from '@/components/app/PageViewsBarChart';
import SessionsChart from '@/components/app/SessionsChart';
import StatCard, { StatCardProps } from '@/components/app/StatCard';
import type {} from '@mui/material/themeCssVarsAugmentation';

const data: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

// Dummy data for DataGrid
const gridColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'product', headerName: 'Product', width: 200 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 90 },
  { field: 'price', headerName: 'Price', type: 'number', width: 120 },
  { field: 'date', headerName: 'Date', width: 150 },
];

const gridRows = [
  { id: 1, product: 'M7X Web App', status: 'Active', quantity: 35, price: 199.99, date: '2023-10-15' },
  { id: 2, product: 'M7X Mobile App', status: 'Pending', quantity: 42, price: 149.99, date: '2023-10-16' },
  { id: 3, product: 'M7X Store', status: 'Active', quantity: 28, price: 299.99, date: '2023-10-17' },
  { id: 4, product: 'M7X Admin', status: 'Inactive', quantity: 15, price: 399.99, date: '2023-10-18' },
  { id: 5, product: 'M7X Analytics', status: 'Active', quantity: 50, price: 249.99, date: '2023-10-19' },
  { id: 6, product: 'M7X Dashboard', status: 'Active', quantity: 22, price: 179.99, date: '2023-10-20' },
  { id: 7, product: 'M7X API', status: 'Pending', quantity: 37, price: 349.99, date: '2023-10-21' },
  { id: 8, product: 'M7X Cloud', status: 'Active', quantity: 45, price: 499.99, date: '2023-10-22' },
  { id: 9, product: 'M7X Security', status: 'Inactive', quantity: 18, price: 279.99, date: '2023-10-23' },
  { id: 10, product: 'M7X Enterprise', status: 'Active', quantity: 60, price: 599.99, date: '2023-10-24' },
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid 
            rows={gridRows}
            columns={gridColumns}
            pageSize={20}
            checkboxSelection={true}
            disableColumnResize={true}
            density="compact"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      {/*  <Copyright sx={{ my: 4 }} /> */}
    </Box>
  );
}
