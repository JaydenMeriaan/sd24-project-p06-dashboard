interface FixedKpiProps {
  title: string;
  value:string;
}

export const FixedKpi = ({ title, value }: FixedKpiProps) => {
  let isPositive = false;
  if(value === 'Stijging'){
    isPositive = true;
  } else{
    isPositive = false;
  }
  const colour = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 text-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </p>

      <div className="flex items-center justify-center gap-2">
        <p className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${colour}`}> 
          {value}
        </p>
      </div>
    </div>
  );
};
