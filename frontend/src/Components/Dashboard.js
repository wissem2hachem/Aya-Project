import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'username', headerName: 'Username', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'createdAt', headerName: 'Created At', width: 200,
    valueFormatter: (params) => new Date(params.value).toLocaleString() 
  },
  { field: 'status', headerName: 'Status', width: 120 }
];

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // WebSocket connection to listen for new users
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_USER') {
        setUsers(prevUsers => [...prevUsers, data.user]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Box sx={{ height: 400, width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Users Dashboard
      </Typography>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default Dashboard;