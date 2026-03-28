// import { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   OutlinedInput,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   IconButton,
//   TextField,
// } from "@mui/material";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DeleteIcon from "@mui/icons-material/Delete";
// import dayjs from "dayjs";
// import { fetchEmployee, sendPayslips } from "../lib/api";

// type Employee = {
//   name: string;
//   email: string;
//   id: string;
// };
// const DEFAULT_MESSAGE_TEMPLATE = `
// <p>Hi {{name}}</p>

// <p>Please let us know immediately if you are not able to download the attachment</p>

// <p>Regards,</p>

// <p>Gautam</p>

// <p style="max-width:120px; height:auto;"><strong>Dr Gautam Chattopadhya</strong></p>

// <p>
//   <a href="mailto:gautam@vistacloud.in">gautam@vistacloud.in</a>
// </p>

// <p>
//   <img
//     src="https://vistacloud.in/path-to-your-logo.png"
//     alt="VistaCloud"
//     style="max-width:120px; height:auto;"
//   />
// </p>

// <p style="max-width:120px; height:auto;">HA-214, Sector-3, Bidhannagar<br/>
// West Bengal 700106</p>

// <p style="; ">Ph: <a href="tel:+61296667183">+61 2 9666 7183</a></p>
// <p style="; ">Mobile/Chat: <a href="tel:+61414676245">+61 414 676 245</a></p>
// <p style="; ">Ph: 1300 768 439 (in Australia only)</p>

// <p>PAN: AAKCV0847</p>
// `;

// export default function SendPayslips() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
//   const [files, setFiles] = useState<Record<string, File | null>>({});
//   const [loading, setLoading] = useState(false);

//   const months = Array.from({ length: 12 }, (_, i) =>
//     dayjs().month(i).format("MMMM"),
//   );

//   const currentYear = new Date().getFullYear();
//   const [payrollMonth, setPayrollMonth] = useState(
//     `${months[new Date().getMonth()]} ${currentYear}`,
//   );
//   const [message, setMessage] = useState<Record<string, string>>({});
//   const [touchedMessages, setTouchedMessages] = useState<Record<string, boolean>>(
//     {},
//   );

//   useEffect(() => {
//     fetchEmployee()
//       .then(setEmployees)
//       .catch((err) => alert(err.message));
//   }, []);

//   const fileToBase64 = (file: File): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64 = reader.result?.toString().split(",")[1];
//         if (base64) resolve(base64);
//         else reject("Failed to read file");
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const handleSubmit = async () => {
//     if (selectedEmployees.length === 0) {
//       alert("Please select employees");
//       return;
//     }

//     setLoading(true);

//     try {
//       const selectedEmployeeObjects = employees.filter((emp) =>
//         selectedEmployees.includes(emp.id),
//       );

//       // Validate files
//       for (const emp of selectedEmployeeObjects) {
//         if (!files[emp.id]) {
//           throw new Error(`Missing PDF for ${emp.name}`);
//         }
//       }

//       const payslips = await Promise.all(
//         selectedEmployeeObjects.map(async (emp) => {
//           return {
//             id: emp.id,
//             name: emp.name,
//             email: emp.email,
//             filename: files[emp.id]!.name,
//             fileBase64: await fileToBase64(files[emp.id]!),
//             message: message[emp.id] || "",
//           };
//         }),
//       );

//       await sendPayslips({
//         payrollMonth,
//         subject: `${payrollMonth} Payslip`,
//         message,
//         payslips,
//       });

//       alert("Payslips sent successfully");

//       setSelectedEmployees([]);
//       setFiles({});
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: "1000px",
//         width: "100%",
//         mx: "auto",
//         mt: 6,
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//       }}
//     >
//       <Typography variant="h6">Send Payslips</Typography>

//       {/* Payroll Month */}
//       <FormControl fullWidth>
//         <InputLabel>Payroll Month</InputLabel>
//         <Select
//           value={payrollMonth}
//           label="Payroll Month"
//           onChange={(e) => setPayrollMonth(e.target.value)}
//         >
//           {months.map((month) => (
//             <MenuItem key={month} value={`${month} ${currentYear}`}>
//               {month} {currentYear}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* Employee Selector */}
//       <FormControl fullWidth>
//         <InputLabel>Select Employees</InputLabel>
//         <Select
//           multiple
//           value={selectedEmployees}
//           onChange={(e) => setSelectedEmployees(e.target.value as string[])}
//           input={<OutlinedInput label="Select Employees" />}
//           renderValue={(selected) => (
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//               {(selected as string[]).map((id) => {
//                 const emp = employees.find((e) => e.id === id);
//                 return <Chip key={id} label={`${emp?.name} (${emp?.email})`} />;
//               })}
//             </Box>
//           )}
//         >
//           {employees.map((emp) => (
//             <MenuItem key={emp.id} value={emp.id}>
//               {emp.name} ({emp.email})
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {selectedEmployees.length > 0 && (
//         <Box sx={{ width: "100%", overflowX: "auto" }}>
//         <Table size="small" sx={{ mt: 2 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <strong>Employee</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Email</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Message</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Attachment</strong>
//               </TableCell>
//               <TableCell align="center">
//                 <strong>Action</strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {employees
//               .filter((emp) => selectedEmployees.includes(emp.id))
//               .map((emp) => (
//                 <TableRow key={emp.id}>
//                   <TableCell>{emp.name}</TableCell>
//                   <TableCell>{emp.email}</TableCell>
//                   <TableCell sx={{ width: 400 }}>
//                     <TextField
//                       multiline
//                       size="medium"
//                       rows={5}
//                       fullWidth
//                       value={message[emp.id] || ""}
//                       onChange={(e) =>
//                         setMessage((prev) => ({
//                           ...prev,
//                           [emp.id]: e.target.value,
//                         }))
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {files[emp.id] ? (
//                       <Typography variant="body2">
//                         {files[emp.id]!.name}
//                       </Typography>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary">
//                         No file selected
//                       </Typography>
//                     )}
//                   </TableCell>

//                   <TableCell align="center">
//                     <IconButton component="label" color="primary">
//                       <UploadFileIcon />
//                       <input
//                         hidden
//                         type="file"
//                         accept="application/pdf"
//                         onChange={(e) =>
//                           setFiles((prev) => ({
//                             ...prev,
//                             [emp.id]: e.target.files?.[0] || null,
//                           }))
//                         }
//                       />
//                     </IconButton>

//                     {files[emp.id] && (
//                       <IconButton
//                         color="error"
//                         onClick={() =>
//                           setFiles((prev) => ({
//                             ...prev,
//                             [emp.id]: null,
//                           }))
//                         }
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         </Box>
//       )}
//       <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//         {loading ? "Sending..." : "Send Payslips"}
//       </Button>
//     </Box>
//   );
// }
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

const DEFAULT_MESSAGE_TEMPLATE = `
<p>Hi {{name}},</p>

<p>Please find attached your payslip.</p>

<p><i>Please let us know immediately if you are not able to download the attachment.</i></p>

<p>Regards,<br/>Gautam</p>

<p style="color:#1a73e8; font-size:12px; line-height:1.5;"><strong>Dr Gautam Chattopadhya</strong></p>

<p>
  <a href="mailto:gautam@vistacloud.in">gautam@vistacloud.in</a>
</p>

<p>
  <img
    src="https://vista-payroll.vercel.app/logo.png"
    alt="VistaCloud"
    style="max-width:120px; height:auto;"
  />
</p>

<div style="color:#1a73e8; font-size:12px; line-height:1.5;">
  HA-214, Sector-3, Bidhannagar<br/>
  West Bengal 700106<br/>
  Ph: +61 2 9666 7183<br/><br/>

  Mobile/Chat: +61 414 676 245<br/>
  Ph: 1300 768 439 (in Australia only)<br/><br/>  
</div>
<p>PAN: AAKCV0847 </p>
`;

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
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Button onClick={handleSubmit} variant="contained">
        {loading ? "Sending..." : "Send Payslips"}
      </Button>
    </Box>
  );
}
