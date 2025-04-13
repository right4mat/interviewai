'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CustomizedDataGrid from '@/components/shared/CustomizedDataGrid';
import type {} from '@mui/material/themeCssVarsAugmentation';
// User data for DataGrid
const userColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 230 },
  { field: 'role', headerName: 'Role', width: 130 },
  { field: 'status', headerName: 'Status', width: 130 },
  { field: 'lastLogin', headerName: 'Last Login', width: 180 },
];

const userRows = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-10-24 09:45:12' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active', lastLogin: '2023-10-23 14:22:36' },
  { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', role: 'Manager', status: 'Active', lastLogin: '2023-10-22 11:15:47' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', role: 'User', status: 'Inactive', lastLogin: '2023-10-15 16:30:22' },
  { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'User', status: 'Active', lastLogin: '2023-10-24 08:12:55' },
  { id: 6, name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'Manager', status: 'Active', lastLogin: '2023-10-23 17:45:10' },
  { id: 7, name: 'David Taylor', email: 'david.t@example.com', role: 'User', status: 'Pending', lastLogin: '2023-10-20 13:25:42' },
  { id: 8, name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'User', status: 'Active', lastLogin: '2023-10-24 10:18:33' },
  { id: 9, name: 'James Martin', email: 'james.m@example.com', role: 'User', status: 'Inactive', lastLogin: '2023-10-10 09:05:18' },
  { id: 10, name: 'Jennifer White', email: 'jennifer.w@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-10-24 07:30:45' },
];

export default function Users() {
  const handleCreateUser = () => {
    // Handle create user logic
    console.log('Create user clicked');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px', } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2,pt: 2   }}>
        <Typography component="h2" variant="h6">
          User Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleCreateUser}
        >
          Create User
        </Button>
      </Box>
      <Box>
        <CustomizedDataGrid 
          rows={userRows}
          columns={userColumns}
          pageSize={10}
          checkboxSelection={true}
          disableColumnResize={false}
          density="standard"
        />
      </Box>
    </Box>
  );
}
