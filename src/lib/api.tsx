export async function fetchEmployeeEmails(): Promise<string[]> {
  const res = await fetch(import.meta.env.VITE_GET_EMPLOYEES_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch employee emails");
  }
  return res.json();
}

export async function sendPayslips(payload: any) {
  const res = await fetch(import.meta.env.VITE_SEND_PAYSLIPS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Failed to send payslips");
  }

  return res.json();
}

