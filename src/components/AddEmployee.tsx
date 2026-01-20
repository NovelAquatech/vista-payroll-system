import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
interface AddEmployeeProps {
  onSave: () => void;
}

export default function AddEmployee({ onSave }: AddEmployeeProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = async () => {
    await fetch(import.meta.env.VITE_ADD_EMPLOYEE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    alert("Employee added");
    setName("");
    setEmail("");
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
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
          
    </Box>
  );
}
