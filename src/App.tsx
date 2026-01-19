import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeList from "./Pages/EmployeeList";
import SendPayslips from "./Pages/SendForm";
import EmployeeStatus from "./Pages/EmployeeStatus";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<EmployeeStatus />} />
        <Route path="/employees" element={<EmployeeList />} />      
        <Route path="/send-payslips" element={<SendPayslips />} />
      </Routes>
      
    </>
  );
}

export default App;
