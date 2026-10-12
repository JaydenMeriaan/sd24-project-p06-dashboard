import { ArrowUp, ArrowDown } from "lucide-react";

interface KpiProps {
  title: string;
  value: number;
  previousValue: number;
}

export const Kpi = ({ title, value, previousValue}: KpiProps) => {
  const isPositive = value >= previousValue;
  const colour = isPositive ? "text-green-500" : "text-red-500";
  const Icon = isPositive ? ArrowUp : ArrowDown;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </p>

      <div className="flex items-center justify-center gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {(value - previousValue).toFixed(2)}
        </p>

        <span className={`text-sm font-medium flex items-center ${colour}`}>
          <Icon />
        </span>
      </div>
    </div>
  );
};
