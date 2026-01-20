export type Employee = {
  name: string;
  email: string;
};
export async function fetchEmployee(): Promise<Employee[]> {
  const res = await fetch(import.meta.env.VITE_GET_EMPLOYEES_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch employee");
  }
  return res.json();
}

export async function sendPayslips(payload: any) {
  const res = await fetch(import.meta.env.VITE_SEND_PAYSLIPS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send payslips");
  }

  return res.json();
}

export async function fetchPayslipStatus(month: string) {
  const url =
    `${import.meta.env.VITE_API_BASE_URL}/payslipStatus` +
    `?month=${encodeURIComponent(month)}` +
    `&code=${import.meta.env.VITE_FUNCTION_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch payslip status");
  return res.json();
}
export async function updateEmployee(payload: { name: string; email: string }) {
  const res = await fetch(`${import.meta.env.VITE_EDIT_EMPLOYEE_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update employee");
}

export async function deleteEmployee(email: string) {
  const url =
    `${import.meta.env.VITE_API_BASE_URL}/deleteEmployee` +
    `?email=${encodeURIComponent(email)}` +
    `&code=${import.meta.env.VITE_FUNCTION_KEY}`;
  const res = await fetch(url, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
}
