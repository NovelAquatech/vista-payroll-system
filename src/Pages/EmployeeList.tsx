import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { fetchEmployee } from "../lib/api";
import CustomModal from "../components/CustomModal";
import AddEmployee from "../components/AddEmployee";
import EditEmployee from "../components/EditEmployee";
import DeleteEmployee from "../components/DeleteEmployee";

type Employee = {
  id: string;
  name: string;
  email: string;
  address: string;
  dob: string;
  salary:string;
};

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployee()
      .then(setEmployees)
      .catch((err) => alert(err.message));
  }, []);
  const handleAddEmployee = () => {
    setModalOpen(true);
  };
  const handleSave = async () => {
    setModalOpen(false);
    const updatedEmployees = await fetchEmployee();
    setEmployees(updatedEmployees);
  };
    const refreshEmployees = async () => {
    const data = await fetchEmployee();
    setEmployees(data);
  };

  // console.log("Employees:", employees);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5 }}>
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" gutterBottom>
          Employee List
        </Typography>
        <Button variant="contained" onClick={handleAddEmployee}>
          + Add Employee
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>DOB</TableCell>            
            <TableCell>Email</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              sx={{
                "&:hover": { backgroundColor: "#f5f5f5" },
                alignItems: "center",
              }}
            >
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.address}</TableCell>
              <TableCell>{employee.dob}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.salary}</TableCell>
              <TableCell>
                <IconButton onClick={() => setEditEmployee(employee)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => setDeleteEmployee(employee)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <AddEmployee onSave={handleSave} />
      </CustomModal>
      <CustomModal
        open={!!editEmployee}
        onClose={() => setEditEmployee(null)}
      >
        {editEmployee && (
          <EditEmployee
            employee={editEmployee}
            onSave={async () => {
              setEditEmployee(null);
              await refreshEmployees();
            }}
          />
        )}
      </CustomModal>
      <CustomModal
        open={!!deleteEmployee}
        onClose={() => setDeleteEmployee(null)}
      >
        {deleteEmployee && (
          <DeleteEmployee
            employee={deleteEmployee}
            onDeleted={async () => {
              setDeleteEmployee(null);
              await refreshEmployees();
            }}
            onCancel={() => setDeleteEmployee(null)}
          />
        )}
      </CustomModal>
    </Box>
  );
}
