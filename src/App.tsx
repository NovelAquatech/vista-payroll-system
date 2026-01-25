import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import EmployeeList from "./Pages/EmployeeList";
import SendPayslips from "./Pages/SendForm";
import EmployeeStatus from "./Pages/EmployeeStatus";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("authToken", tokenFromUrl);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);
  // const handleBack = () => {
  //   // Optional: clear auth token when leaving Website B
  //   localStorage.removeItem("authToken");
  //   window.location.href = import.meta.env.VITE_VISTA_URL;
  // };
  return (
    <>
      <Navbar />
      {/* <Box
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
          Back
        </Typography>
      </Box> */}
      <Routes>
        <Route path="/" element={<EmployeeStatus />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/send-payslips" element={<SendPayslips />} />
      </Routes>
    </>
  );
}

export default App;
