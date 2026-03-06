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
  IconButton,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import { fetchPayslipStatus, getFileUrl } from "../lib/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const [loading, setLoading] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("YYYY-MM"),
  );

  useEffect(() => {
    setLoading(true);
    fetchPayslipStatus(month).then(setRows);
    setLoading(false);
  }, [month]);
  const handleBack = () => {
    // Optional: clear auth token when leaving Website B
    localStorage.removeItem("authToken");
    window.location.href = import.meta.env.VITE_VISTA_URL;
  };

const handleDownload = async (fileName: string) => {
  console.log("Initiating download for:", fileName);
  try {
    const res = await getFileUrl(fileName);
    
    // Fetch the file as a blob to stay within the React context
    const response = await fetch(res.url);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName; // Force download filename
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
    console.log("Initiating download for:", blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        onClick={handleBack}
        sx={{
          cursor: "pointer",
          mr: 2,
          "&:hover": { opacity: 0.85 },
        }}
      >
        <IconButton color="inherit" size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1" sx={{ ml: 0.5 }}>
          Back to VistaCloud
        </Typography>
      </Box>
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
          {loading ? (
            <CircularProgress sx={{ display: "block", mx: "auto" }} />
          ) : (
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.email}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {row.fileName || "-"}
                      {row.fileName && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<FileDownloadIcon />}
                          onClick={() => handleDownload(row.fileName)}
                          sx={{
                            textTransform: "none", // Keeps text from being all caps
                            borderRadius: 50, 
                          }}
                        >
                          {/* You can leave this empty for just an icon button like the image, 
            or add text like "Download" */}
                        </Button>
                      )}
                    </Box>
                  </TableCell>
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
          )}
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
    </>
  );
}
