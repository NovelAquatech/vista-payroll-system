import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
interface AddEmployeeProps {
  onSave: () => void;
}

export default function AddEmployee({ onSave }: AddEmployeeProps) {
  const [name, setName] = useState("");
  const[address, setAddress] = useState("");
  const[dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const[salary, setSalary] = useState("");

  const handleSave = async () => {
    await fetch(import.meta.env.VITE_ADD_EMPLOYEE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, address, dob, salary }),
    });

    alert("Employee added");
    setName("");
    setEmail("");
    setAddress("");
    setDob("");
    setSalary("");
    onSave();
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <TextField
        label="DOB"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
          
    </Box>
  );
}
