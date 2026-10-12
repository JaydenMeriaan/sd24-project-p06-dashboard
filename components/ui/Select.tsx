import { prisma } from "@/lib/prisma";

interface SelectOption {
  value: string | number;
  label: string;
}
interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  id: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({ options, ...props }: SelectProps) => {
  return (
    <select className="border p-2 rounded w-full" {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
