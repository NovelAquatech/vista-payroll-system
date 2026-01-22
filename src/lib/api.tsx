import authFetch  from "./auth";
export type Employee = {
  id: string;
  name: string;
  email: string;
};
export async function fetchEmployee(): Promise<Employee[]> {
  const res = await authFetch(import.meta.env.VITE_GET_EMPLOYEES_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch employee");
  }
  return res.json();
}

export async function sendPayslips(payload: any) {
  const res = await authFetch(import.meta.env.VITE_SEND_PAYSLIPS_URL, {
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

  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch payslip status");
  return res.json();
}
export async function updateEmployee(payload: { id:string,name: string; email: string }) {
  const res = await authFetch(`${import.meta.env.VITE_EDIT_EMPLOYEE_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update employee");
}

export async function deleteEmployee(id: string) {
  const url =
    `${import.meta.env.VITE_API_BASE_URL}/deleteEmployee` +
    `?id=${id}` +
    `&code=${import.meta.env.VITE_FUNCTION_KEY}`;
  const res = await authFetch(url, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
}
