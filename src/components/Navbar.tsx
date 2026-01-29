import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const handleLogout = () => {    
    localStorage.removeItem("authToken");    
    window.location.href = "https://vistacloud.in";
  };
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Employees", path: "/employees" },
    { label: "Send Payslips", path: "/send-payslips" },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          VistaCloud Payroll
        </Typography>

        <Box>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              sx={{
                textDecoration:
                  location.pathname === item.path ? "underline" : "none",
              }}
            >
              {item.label}
            </Button>
          ))}
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
