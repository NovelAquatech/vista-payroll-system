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
  TextField,
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

const DEFAULT_MESSAGE_TEMPLATE = `Hi {{name}},

Please find attached your payslip.

Please let us know immediately if you are not able to download the attachment.

Regards,
Gautam`;

function buildMessage(template: string, name: string) {
  return template.replaceAll("{{name}}", name || "there");
}

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

  const [message, setMessage] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const applyTemplate = (ids: string[]) => {
    setMessage((prev) => {
      const updated = { ...prev };

      ids.forEach((id) => {
        const emp = employees.find((e) => e.id === id);
        if (!emp) return;

        if (!updated[id] && !touched[id]) {
          updated[id] = buildMessage(DEFAULT_MESSAGE_TEMPLATE, emp.name);
        }
      });

      return updated;
    });
  };

  const handleEmployeeChange = (ids: string[]) => {
    setSelectedEmployees(ids);
    applyTemplate(ids);
  };

  const handleMessageChange = (id: string, value: string) => {
    setMessage((prev) => ({ ...prev, [id]: value }));
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees");
      return;
    }

    setLoading(true);

    try {
      const selected = employees.filter((e) =>
        selectedEmployees.includes(e.id),
      );

      for (const emp of selected) {
        if (!files[emp.id]) {
          throw new Error(`Missing PDF for ${emp.name}`);
        }
      }

      const payslips = await Promise.all(
        selected.map(async (emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          filename: files[emp.id]!.name,
          fileBase64: await fileToBase64(files[emp.id]!),
          message: message[emp.id],
        })),
      );

      await sendPayslips({
        payrollMonth,
        subject: `${payrollMonth} Payslip`,
        message,
        payslips,
      });

      alert("Payslips sent successfully");

      setSelectedEmployees([]);
      setFiles({});
      setMessage({});
      setTouched({});
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        width: "100%",
        mx: "auto",
        mt: 6,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h6">Send Payslips</Typography>

      <FormControl fullWidth>
        <InputLabel>Payroll Month</InputLabel>
        <Select
          value={payrollMonth}
          label="Payroll Month"
          onChange={(e) => setPayrollMonth(e.target.value)}
        >
          {months.map((m) => (
            <MenuItem key={m} value={`${m} ${currentYear}`}>
              {m} {currentYear}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Select Employees</InputLabel>
        <Select
          multiple
          value={selectedEmployees}
          onChange={(e) => handleEmployeeChange(e.target.value as string[])}
          input={<OutlinedInput label="Select Employees" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as string[]).map((id) => {
                const emp = employees.find((e) => e.id === id);
                return <Chip key={id} label={`${emp?.name}`} />;
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

      {selectedEmployees.length > 0 && (
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Attachment</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees
                .filter((e) => selectedEmployees.includes(e.id))
                .map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>

                    <TableCell sx={{ width: 450 }}>
                      <TextField
                        multiline
                        rows={10}
                        fullWidth
                        value={message[emp.id] || ""}
                        onChange={(e) =>
                          handleMessageChange(emp.id, e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {files[emp.id]?.name || "No file"}
                    </TableCell>

                    <TableCell>
                      <IconButton component="label">
                        <UploadFileIcon />
                        <input
                          hidden
                          type="file"
                          accept="application/pdf"
                          onChange={(e) =>
                            setFiles((p) => ({
                              ...p,
                              [emp.id]: e.target.files?.[0] || null,
                            }))
                          }
                        />
                      </IconButton>

                      {files[emp.id] && (
                        <IconButton
                          color="error"
                          onClick={() =>
                            setFiles((p) => ({
                              ...p,
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
        </Box>
      )}

      <Button onClick={handleSubmit} variant="contained" disabled={loading}>
        {loading ? "Sending..." : "Send Payslips"}
      </Button>
    </Box>
  );
}