import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/Button";
import { Kpi } from "@/components/ui/Kpi";
import { Select } from "@/components/ui/Select";
import { prisma } from "@/lib/prisma";

async function getSdgCountriesAsOptions() {
  const sdgCountries = await prisma.sdgcountry.findMany();

  const options: any[] = [];
  sdgCountries.forEach((item: any) => {
    options.push({
      value: item.id,
      label: item.name,
    });
  });
  return options;
}

type PageProps = {
  searchParams?: {
    countryId?: string;
  };
};

async function getSdgData(serieId: number, countryId: number) {
  const sdgData = await prisma.sdgvalue.findMany({
    where: {
      country_id: countryId,
      serie_id: serieId,
    },
    include: {
      sdgserie: true,
      sdgcountry: true,
    },
    orderBy: {
      year: "asc",
    },
  });
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

  const sdgData1 = await getSdgData(51, countryId);
  const data1 = prepareDataForGraph(sdgData1);

  const sdgData2 = await getSdgData(52, countryId);
  const data2 = prepareDataForGraph(sdgData2);

  const sdgData3 = await getSdgData(53, countryId);
  const data3 = prepareDataForGraph(sdgData3);

  const optionArray = await getSdgCountriesAsOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-blue-200">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-blue-400">
            Leven op het Land
          </h1>

          <form method="GET" className="flex justify-center gap-4">
            <Select
              id="countryId"
              name="countryId"
              options={optionArray}
            />
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">
              Submit
            </Button>
          </form>

          <div>
            Data for country:{" "}
            <span className="font-semibold text-blue-500">
              {sdgData1[0]?.sdgcountry?.name}
            </span>
          </div>

          {/* KPI SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-5">
            <div></div>

            <div className="bg-slate-900 rounded-2xl p-5 border border-blue-900 shadow-md">
              <Kpi
                title="Land area (thousands of hectares):"
                value={
                  data1.datasets[0].data[
                    data1.datasets[0].data.length - 1
                  ]
                }
                previousValue={
                  data1.datasets[0].data[
                    data1.datasets[0].data.length - 2
                  ]
                }
              />
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 border border-blue-900 shadow-md">
              <Kpi
                title="Forest area (thousands of hectares):"
                value={
                  data2.datasets[0].data[
                    data2.datasets[0].data.length - 1
                  ]
                }
                previousValue={
                  data2.datasets[0].data[
                    data2.datasets[0].data.length - 2
                  ]
                }
              />
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 border border-blue-900 shadow-md md:col-span-3">
              <Kpi
                title="Forest area as a proportion of total land area:"
                value={
                  data3.datasets[0].data[
                    data3.datasets[0].data.length - 1
                  ]
                }
                previousValue={
                  data3.datasets[0].data[
                    data3.datasets[0].data.length - 2
                  ]
                }
              />
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-md text-slate-900">
              <BarChart data={data1} />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-md text-slate-900">
              <LineChart data={data2} />
            </div>

            <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-md text-slate-900 md:col-span-2">
              <LineChart data={data3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
