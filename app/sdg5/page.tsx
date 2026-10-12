import { BarChart } from "@/components/charts/BarChart";
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
  return prisma.sdgvalue.findMany({
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
}

function prepareDataForGraph(sdgData: any[]) {
  const labels: string[] = [];
  const values: number[] = [];

  sdgData.forEach((item) => {
    labels.push(item.year ? item.year.toString() : "-1");
    values.push(item.value ? item.value.toNumber() : 0);
  });

  return {
    labels,
    datasets: [
      {
        label: sdgData[0]?.sdgserie.description,
        data: values,
      },
    ],
  };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const countryIdParam = searchParams?.countryId ?? "";
  const countryId = countryIdParam ? Number(countryIdParam) : -1;

  const sdgData1 =
    countryId !== -1 ? await getSdgData(6, countryId) : [];

  const data1 =
    sdgData1.length > 0 ? prepareDataForGraph(sdgData1) : null;

  const optionArray = await getSdgCountriesAsOptions();

  const latestValue =
    data1 && data1.datasets[0].data.length > 0
      ? data1.datasets[0].data[data1.datasets[0].data.length - 1]
      : 0;

  const previousValue =
    data1 && data1.datasets[0].data.length > 1
      ? data1.datasets[0].data[data1.datasets[0].data.length - 2]
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-blue-200">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="space-y-12 text-center">
          {/* TITLE */}
          <h1 className="text-5xl font-bold text-blue-400">
            Kwaliteitsonderwijs
          </h1>

          {/* SELECT */}
          <form method="GET" className="flex justify-center gap-4">
            <Select
              id="countryId"
              name="countryId"
              options={optionArray}
            />
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">
              Bekijk data
            </Button>
          </form>

          {/* COUNTRY */}
          <div>
            Data voor land:{" "}
            <span className="font-semibold text-blue-500">
              {sdgData1[0]?.sdgcountry?.name}
            </span>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div></div>

            <div className="bg-slate-900 rounded-2xl shadow-md p-6 border border-blue-900">
              <Kpi
                title="Minimum lees- en rekenvaardigheid"
                value={latestValue}
                previousValue={previousValue}
              />
            </div>

            <div></div>
          </div>

          {/* CHART */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-200 text-slate-900">
              {data1 && <BarChart data={data1} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
