import {
  Box,
  Button,
  Typography
} from "@mui/material";
import { deleteEmployee } from "../lib/api";

type Employee = {
  id: string;
  name: string;
  email: string;
};

interface DeleteEmployeeProps {
  employee: Employee;
  onDeleted: () => void;
  onCancel: () => void;
}

export default function DeleteEmployee({
  employee,
  onDeleted,
  onCancel
}: DeleteEmployeeProps) {
  const handleDelete = async () => {
    try {
      await deleteEmployee(employee.id);
      onDeleted();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Delete Employee
      </Typography>

      <Typography mb={3}>
        Are you sure you want to delete <strong>{employee.name}</strong>?
      </Typography>

      <Box display="flex" gap={2}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Yes, Delete
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
