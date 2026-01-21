import dayjs from "dayjs";
import { Select, MenuItem } from "@mui/material";

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM")
  );
  const year = dayjs().year();

  return (
    <Select value={value} onChange={e => onChange(e.target.value)}>
      {months.map(m => (
        <MenuItem key={m} value={`${year}-${String(months.indexOf(m)+1).padStart(2,"0")}`}>
          {m} {year}
        </MenuItem>
      ))}
    </Select>
  );
}
