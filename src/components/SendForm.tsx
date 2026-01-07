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
} from "@mui/material";
import dayjs from "dayjs";
import { fetchEmployeeEmails, sendPayslips } from "../lib/api";

export default function SendPayslips() {
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM")
  );

  const currentYear = new Date().getFullYear();
  const [payrollMonth, setPayrollMonth] = useState(
    `${months[new Date().getMonth()]} ${currentYear}`
  );
  useEffect(() => {
    fetchEmployeeEmails()
      .then(setEmails)
      .catch((err) => alert(err.message));
  }, []);
  // console.log(emails)
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
    if (!file || selectedEmails.length === 0) {
      alert("Please select employees and upload a PDF");
      return;
    }

    setLoading(true);

    try {
      const base64 = await fileToBase64(file);

      const payslips = selectedEmails.map((email) => ({
        email,
        filename: file.name,
        fileBase64: base64,
      }));

      await sendPayslips({
        subject: `${payrollMonth} Payslip`,
        message: `
          <p>Dear Employee,</p>
          <p>Please find attached your <strong>${payrollMonth} payslip</strong>.</p>
          <p>Have a nice day.<br/><strong>VistaCloud Team</strong></p>
        `,
        payslips,
      });

      alert("Payslips sent successfully");
      setSelectedEmails([]);
      setFile(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
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
      <Typography variant="h6">Send Payslips</Typography>
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
      <FormControl>
        <InputLabel>Select Employees</InputLabel>
        <Select
          multiple
          value={selectedEmails}
          onChange={(e) => setSelectedEmails(e.target.value as string[])}
          input={<OutlinedInput label="Select Employees" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {emails.map((email) => (
            <MenuItem key={email} value={email}>
              {email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" component="label">
        Upload file (PDF)
        <input
          hidden
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </Button>

      {file && <Typography variant="body2">{file.name}</Typography>}

      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? "Sending..." : "Send Payslips"}
      </Button>
    </Box>
  );
}
