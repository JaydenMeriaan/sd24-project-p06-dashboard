import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { prisma } from "@/lib/prisma";
import { Kpi } from "@/components/ui/Kpi";
import { FixedKpi } from "@/components/ui/FixedKpi";
import SdgDataTableClient from "@/components/ui/SdgDataTableClient";
async function getSdgCountriesAsOptions(){
   const sdgCountries = await prisma.sdgcountry.findMany();
   const options : any[] = [];
   sdgCountries.forEach((item : any) =>{
       options.push({
           value: item.id,
           label: item.name
       });
   })
   return options;
}
type PageProps = {
 searchParams?: {
   countryId?: string;
 };
};
async function getSdgData(serieId : number, countryId : number) {
   const sdgData = await prisma.sdgvalue.findMany( {
   where: {
       country_id: countryId,
       serie_id: serieId
   },
   include: {
       sdgserie: true,
       sdgcountry: true
   },
   orderBy:{
       year: 'asc'
   }});
   return sdgData;
}
function prepareDataForGraph(sdgData: any[]) {
 const labels: string[] = [];
 const values: number[] = [];
 sdgData.forEach((item) => {
   labels.push(item.year ? item.year?.toString() : "-1");
   values.push(item.value ? item.value.toNumber() : -1);
 });
 const data = {
   labels: labels,
   datasets: [
     {
       label: sdgData[0]?.sdgserie.description,
       data: values,
     },
   ],
 };
 return data;
}
export default async function DashboardPage({ searchParams }: PageProps) {
 const countryIdParam = searchParams?.countryId ?? "";
 const countryId = countryIdParam ? Number(countryIdParam) : -1;
 console.log(countryId);
 const sdgData1 = await getSdgData(17, countryId);
 const data1 = prepareDataForGraph(sdgData1);
 const optionArray = await getSdgCountriesAsOptions();
 const lastValue =
   data1.datasets[0].data[data1.datasets[0].data.length - 1];
 const previousValue =
   data1.datasets[0].data[0];
 let trendText = "Geen verandering";
 if (lastValue > previousValue) {
   trendText = "Stijging";
 } else if (lastValue < previousValue) {
   trendText = "Daling";
 }
 // Maak rows “browser-safe” (geen Prisma Decimal objecten doorgeven)
 const tableRows = sdgData1.map((m: any) => ({
   id: m.id,
   year: m.year ?? null,
   country: m.sdgcountry?.name ?? "",
   metric: m.sdgserie?.description ?? "",
   value: m.value ? m.value.toNumber() : null,
   source: m.source ?? "", // als hij geen source field heeft blijft dit leeg
 }));
 return (
<div className="min-h-screen bg-gradient-to-b from-stone-400 to-stone-400 dark:from-gray-900 dark:to-gray-800">
<div className="max-w-4xl mx-auto px-4 py-16">
<div className="text-center space-y-8">
<h1 className="text-5xl font-bold text-gray-900 dark:text-white">
           Ongelijkheid Verminderen
</h1>
<form method="GET">
<Select
             id="countryId"
             name="countryId"
             options={optionArray}
></Select>
<Button>Submit</Button>
</form>
<div>
           Data for country: {sdgData1[0]?.sdgcountry?.name}
</div>
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-5">
<div></div>
<Kpi
             title="Proportion of people living below 50 percent of median income :"
             value={data1.datasets[0].data[data1.datasets[0].data.length - 1]}
             previousValue={data1.datasets[0].data[0]}
></Kpi>
<FixedKpi title="Trend"
             value={trendText}></FixedKpi>
</div>
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols- -5 gap-5">
<div>
<BarChart data={data1}></BarChart>
</div>
<div>
<LineChart data={data1}></LineChart>
</div>
</div>
         {/* ✅ Gegevenstabel + CSV (client component) onder charts */}
<SdgDataTableClient rows={tableRows} />
</div>
</div>
</div>
 );
}