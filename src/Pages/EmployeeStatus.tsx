import { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Box
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";

type StatusRow = {
  name: string;
  email: string;
  month: string;
  fileName: string;
  sent: boolean;
  sentAt: string;
};

export default function EmployeeStatus() {
  const [rows, setRows] = useState<StatusRow[]>([]);
  const month = "2026-01"; // dynamic later

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/payslipStatus?month=${month}`)
      .then(res => res.json())
      .then(setRows);
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        Payslip Dispatch Status – Jan 2026
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Sent At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow key={row.email}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.month}</TableCell>
              <TableCell>{row.fileName || "-"}</TableCell>
              <TableCell>
                {row.sent ? <CheckIcon color="success" /> : ""}
              </TableCell>
              <TableCell>
                {row.sentAt
                  ? dayjs(row.sentAt).format("DD-MMM-YYYY HH:mm")
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
