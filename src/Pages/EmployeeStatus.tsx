import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";
import { fetchPayslipStatus } from "../lib/api";

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
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("YYYY-MM"),
  );

  useEffect(() => {
    fetchPayslipStatus(month).then(setRows);
  }, [month]);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5 }}>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Payslip Dispatch Status – {dayjs(month).format("MMMM YYYY")}
        </Typography>
        {/*Month Selector*/}
        <FormControl size="small" sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((m) => (
              <MenuItem key={m} value={m}>
                {dayjs(m).format("MMMM YYYY")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="employee status table">
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
          {rows.map((row) => (
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
      <Pagination
        count={12}
        page={dayjs(month).month() + 1}
        onChange={(_, page) =>
          setMonth(
            dayjs()
              .month(page - 1)
              .format("YYYY-MM"),
          )
        }
        sx={{ mt: 5, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
}
