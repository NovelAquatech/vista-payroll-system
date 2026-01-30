import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ProtectedRoute } from "./lib/auth";
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

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <EmployeeStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/send-payslips"
          element={
            <ProtectedRoute>
              <SendPayslips />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
