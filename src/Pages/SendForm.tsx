import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { fetchEmployee, sendPayslips } from "../lib/api";

type Employee = {
  name: string;
  email: string;
  id: string;
};

export default function SendPayslips() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM"),
  );

  const currentYear = new Date().getFullYear();
  const [payrollMonth, setPayrollMonth] = useState(
    `${months[new Date().getMonth()]} ${currentYear}`,
  );

  useEffect(() => {
    fetchEmployee()
      .then(setEmployees)
      .catch((err) => alert(err.message));
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(",")[1];
        if (base64) resolve(base64);
        else reject("Failed to read file");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees");
      return;
    }

    setLoading(true);

    try {
      const selectedEmployeeObjects = employees.filter((emp) =>
        selectedEmployees.includes(emp.id),
      );

      // Validate files
      for (const emp of selectedEmployeeObjects) {
        if (!files[emp.id]) {
          throw new Error(`Missing PDF for ${emp.name}`);
        }
      }

      const payslips = await Promise.all(
        selectedEmployeeObjects.map(async (emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          filename: files[emp.id]!.name,
          fileBase64: await fileToBase64(files[emp.id]!),
        })),
      );

      await sendPayslips({
        payrollMonth,
        subject: `${payrollMonth} Payslip`,
        message: `
          <p>Dear Employee,</p>
          <p>Please find attached your <strong>${payrollMonth} payslip</strong>.</p>
          <p>Have a nice day.<br/><strong>VistaCloud Team</strong></p>
        `,
        payslips,
      });

      alert("Payslips sent successfully");

      setSelectedEmployees([]);
      setFiles({});
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h6">Send Payslips</Typography>

      {/* Payroll Month */}
      <FormControl fullWidth>
        <InputLabel>Payroll Month</InputLabel>
        <Select
          value={payrollMonth}
          label="Payroll Month"
          onChange={(e) => setPayrollMonth(e.target.value)}
        >
          {months.map((month) => (
            <MenuItem key={month} value={`${month} ${currentYear}`}>
              {month} {currentYear}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Employee Selector */}
      <FormControl fullWidth>
        <InputLabel>Select Employees</InputLabel>
        <Select
          multiple
          value={selectedEmployees}
          onChange={(e) => setSelectedEmployees(e.target.value as string[])}
          input={<OutlinedInput label="Select Employees" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as string[]).map((id) => {
                const emp = employees.find((e) => e.id === id);
                return <Chip key={id} label={`${emp?.name} (${emp?.email})`} />;
              })}
            </Box>
          )}
        >
          {employees.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.name} ({emp.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* File upload per employee */}
      {/* {employees
        .filter((emp) => selectedEmployees.includes(emp.id))
        .map((emp) => (
          <Box
            key={emp.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <Typography>{emp.name}</Typography>

            <Button variant="outlined" component="label">
              Upload PDF
              <input
                hidden
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFiles((prev) => ({
                    ...prev,
                    [emp.id]: e.target.files?.[0] || null
                  }))
                }
              />
            </Button>

            {files[emp.id] && (
              <Typography variant="body2">
                {files[emp.id]!.name}
              </Typography>
            )}
          </Box>
        ))} */}
      {selectedEmployees.length > 0 && (
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Employee</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Attachment</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees
              .filter((emp) => selectedEmployees.includes(emp.id))
              .map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>

                  <TableCell>
                    {files[emp.id] ? (
                      <Typography variant="body2">
                        {files[emp.id]!.name}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No file selected
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton component="label" color="primary">
                      <UploadFileIcon />
                      <input
                        hidden
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          setFiles((prev) => ({
                            ...prev,
                            [emp.id]: e.target.files?.[0] || null,
                          }))
                        }
                      />
                    </IconButton>

                    {files[emp.id] && (
                      <IconButton
                        color="error"
                        onClick={() =>
                          setFiles((prev) => ({
                            ...prev,
                            [emp.id]: null,
                          }))
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? "Sending..." : "Send Payslips"}
      </Button>
    </Box>
  );
}
