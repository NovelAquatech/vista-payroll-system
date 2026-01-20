import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";
import { updateEmployee } from "../lib/api";

type Employee = {
  name: string;
  email: string;
};

interface EditEmployeeProps {
  employee: Employee;
  onSave: () => void;
}

export default function EditEmployee({ employee, onSave }: EditEmployeeProps) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name || !email) {
      alert("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      await updateEmployee({
        // originalEmail: employee.email,
        name,
        email
      });
      onSave();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">Edit Employee</Typography>

      <TextField
        label="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
}

