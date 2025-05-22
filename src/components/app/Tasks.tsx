"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CustomizedDataGrid from "@/components/shared/CustomizedDataGrid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { type SelectChangeEvent } from "@mui/material/Select";

import type {} from '@mui/material/themeCssVarsAugmentation';
import CustomSelect from "@/components/shared/CustomizedSelect";
import CustomInput from "@/components/shared/CustomizedInput";


// Task data for DataGrid
const taskColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "description", headerName: "Description", width: 250 },
  { field: "assignee", headerName: "Assignee", width: 150 },
  { field: "priority", headerName: "Priority", width: 120 },
  { field: "status", headerName: "Status", width: 120 },
  { field: "dueDate", headerName: "Due Date", width: 150 }
];

const taskRows = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Draft the initial project proposal document",
    assignee: "John Doe",
    priority: "High",
    status: "In Progress",
    dueDate: "2023-11-05"
  },
  {
    id: 2,
    title: "Review code changes",
    description: "Review pull request #42 for the frontend module",
    assignee: "Jane Smith",
    priority: "Medium",
    status: "Pending",
    dueDate: "2023-11-03"
  },
  {
    id: 3,
    title: "Fix login bug",
    description: "Address the authentication issue on mobile devices",
    assignee: "Robert Johnson",
    priority: "Critical",
    status: "In Progress",
    dueDate: "2023-11-01"
  },
  {
    id: 4,
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    assignee: "Emily Davis",
    priority: "Low",
    status: "Completed",
    dueDate: "2023-10-28"
  },
  {
    id: 5,
    title: "Client meeting preparation",
    description: "Prepare slides for the upcoming client demo",
    assignee: "Michael Brown",
    priority: "High",
    status: "Not Started",
    dueDate: "2023-11-07"
  },
  {
    id: 6,
    title: "Database optimization",
    description: "Optimize database queries for better performance",
    assignee: "Sarah Wilson",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2023-11-10"
  },
  {
    id: 7,
    title: "User testing",
    description: "Conduct user testing for the new features",
    assignee: "David Taylor",
    priority: "High",
    status: "Not Started",
    dueDate: "2023-11-15"
  },
  {
    id: 8,
    title: "Security audit",
    description: "Perform security audit on the application",
    assignee: "Lisa Anderson",
    priority: "Critical",
    status: "Pending",
    dueDate: "2023-11-08"
  }
];

export default function Tasks() {
  const [open, setOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    assignee: "",
    priority: "",
    status: "Not Started",
    dueDate: ""
  });
  const [tasks, setTasks] = React.useState(taskRows);

  const handleCreateTask = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setNewTask((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setNewTask((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const newTaskWithId = {
      ...newTask,
      id: tasks.length + 1
    };
    setTasks([...tasks, newTaskWithId]);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "",
      status: "Not Started",
      dueDate: ""
    });
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pt: 2 }}>
        <Typography component="h2" variant="h6">
          Task Management
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateTask}>
          Create Task
        </Button>
      </Box>
      <Box>
        <CustomizedDataGrid
          rows={tasks}
          columns={taskColumns}
          pageSize={10}
          checkboxSelection={true}
          disableColumnResize={false}
          density="standard"
        />
      </Box>

      {/* Create Task Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleSubmit();
            },
            sx: { backgroundImage: 'none' },
          },
        }}
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <CustomInput
              placeholder="Task Title"
              name="title"
              label="Task Title"
              value={newTask.title}
              onChange={handleChange}
              required
            />
            <CustomInput
              placeholder="Description"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={newTask.description}
              onChange={handleChange}
            />
            <CustomInput
              placeholder="Assignee"
              name="assignee"
              label="Assignee"
              value={newTask.assignee}
              onChange={handleChange}
            />
            <CustomSelect
              name="priority"
              value={newTask.priority}
              onChange={handleSelectChange}
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Critical", label: "Critical" }
              ]}
              placeholder="Select Priority"
            />
            <CustomSelect
              name="status"
              value={newTask.status}
              onChange={handleSelectChange}
              options={[
                { value: "Not Started", label: "Not Started" },
                { value: "In Progress", label: "In Progress" },
                { value: "Pending", label: "Pending" },
                { value: "Completed", label: "Completed" }
              ]}
              placeholder="Select Status"
            />
            <CustomInput
              placeholder="Due Date"
              name="dueDate"
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
