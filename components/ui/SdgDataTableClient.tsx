"use client";
export default function SdgDataTableClient({
 rows,
}: {
 rows: {
   id: string;
   year: number | null;
   country: string;
   metric: string;
   value: number | null;
   source: string;
 }[];
}) {
 const exportToCSV = () => {
   const headers = ["Year", "Country", "Metric", "Value", "Source"];
   const escape = (s: string) => `"${String(s ?? "").replace(/"/g, '""')}"`;
   const csvContent = [
     headers.join(","),
     ...rows.map((m) =>
       [
         m.year ?? "",
         escape(m.country),
         escape(m.metric),
         m.value ?? "",
         escape(m.source ?? ""),
       ].join(",")
     ),
   ].join("\n");
   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
   const link = document.createElement("a");
   const url = URL.createObjectURL(blob);
   link.setAttribute("href", url);
   link.setAttribute("download", "sdg_data.csv");
   link.style.visibility = "hidden";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 };
 return (
<div className="mt-10 text-left">
<div className="mb-4 flex items-center justify-between gap-4">
<div>
<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
           Gegevenstabel
</h3>
<p className="text-sm text-stone-700 dark:text-stone-200">
           Toont {rows.length} rijen.
</p>
</div>
<button
         onClick={exportToCSV}
         className="px-4 py-2 rounded-lg border border-stone-700/40 bg-stone-200/70 text-gray-900 hover:bg-stone-200 dark:bg-gray-900/40 dark:text-white dark:hover:bg-gray-900/60 transition"
>
         Download CSV
</button>
</div>
<div className="overflow-x-auto rounded-xl border border-stone-600/40 bg-stone-100/70 dark:bg-gray-900/50">
<table className="min-w-full text-sm">
<thead className="bg-stone-200/80 dark:bg-gray-800/60">
<tr className="text-left text-gray-900 dark:text-white">
<th className="py-3 px-4">Year</th>
<th className="py-3 px-4">Country</th>
<th className="py-3 px-4">Metric</th>
<th className="py-3 px-4">Value</th>
<th className="py-3 px-4">Source</th>
</tr>
</thead>
<tbody>
           {rows.map((m) => (
<tr
               key={m.id}
               className="border-t border-stone-600/30 hover:bg-stone-200/40 dark:hover:bg-gray-800/40 text-gray-900 dark:text-white"
>
<td className="py-2 px-4">{m.year ?? "—"}</td>
<td className="py-2 px-4">{m.country || "—"}</td>
<td className="py-2 px-4">{m.metric || "—"}</td>
<td className="py-2 px-4">{m.value ?? "—"}</td>
<td className="py-2 px-4">{m.source || "—"}</td>
</tr>
           ))}
           {rows.length === 0 && (
<tr>
<td colSpan={5} className="py-6 px-4 text-stone-700 dark:text-stone-200">
                 Geen rijen om te tonen.
</td>
</tr>
           )}
</tbody>
</table>
</div>
</div>
 );
}