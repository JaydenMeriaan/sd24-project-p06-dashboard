import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/Button";
import { Kpi } from "@/components/ui/Kpi";
import { Select } from "@/components/ui/Select";
import { prisma } from "@/lib/prisma";

async function getSdgCountriesAsOptions() {
  const sdgCountries = await prisma.sdgcountry.findMany();
  return sdgCountries.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));
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
    orderBy: { year: "asc" },
  });
}

function prepareDataForGraph(sdgData: any[]) {
  return {
    labels: sdgData.map((item) =>
      item.year ? item.year.toString() : "-"
    ),
    datasets: [
      {
        label: sdgData[0]?.sdgserie.description,
        data: sdgData.map((item) =>
          item.value ? item.value.toNumber() : -1
        ),
      },
    ],
  };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const countryId = searchParams?.countryId
    ? Number(searchParams.countryId)
    : -1;

  const optionArray = await getSdgCountriesAsOptions();

  const sdgData1 = await getSdgData(1, countryId);
  const sdgData2 = await getSdgData(2, countryId);

  const data1 = prepareDataForGraph(sdgData1);
  const data2 = prepareDataForGraph(sdgData2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-16">

        <section className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 dark:text-blue-300">
            SDG 1 Geen armoede
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl">
            Armoede in al haar vormen overal ter wereld beëindigen.
            SDG 1 vormt de basis voor alle andere duurzame ontwikkelingsdoelen.
          </p>
        </section>

        
        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Wat betekent SDG 1?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              SDG 1 gaat verder dan alleen inkomen. Het richt zich op het
              wegnemen van structurele oorzaken van armoede, zoals beperkte
              toegang tot onderwijs, gezondheidszorg, sociale bescherming
              en economische kansen.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Mensen in armoede zijn kwetsbaarder voor economische schokken,
              conflicten en klimaatverandering. Daarom is het terugdringen
              van armoede essentieel voor duurzame ontwikkeling.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow space-y-4">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
              Kernpunten van SDG 1
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Extreme armoede volledig uitbannen</li>
              <li>Sociale bescherming voor iedereen</li>
              <li>Gelijke toegang tot economische middelen</li>
              <li>Weerbaarheid tegen economische en klimaatrisico’s</li>
            </ul>
          </div>
        </section>

     
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Belangrijkste targets
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                Extreme armoede
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Het beëindigen van extreme armoede, gedefinieerd als leven
                onder de internationale armoedegrens.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                Sociale bescherming
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Toegang tot sociale vangnetten zoals uitkeringen, zorg en
                ondersteuning bij tegenslag.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                Gelijke kansen
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Iedereen moet gelijke toegang hebben tot werk, middelen en
                economische kansen.
              </p>
            </div>
          </div>
        </section>

   
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            SDG 1 in cijfers
          </h2>
          <form method="GET" className="flex justify-center gap-4">
            <Select id="countryId" name="countryId" options={optionArray} />
            <Button>Bekijk data</Button>
          </form>

          <div className="text-center text-lg font-medium text-gray-900 dark:text-white">
            Data voor land: {sdgData1[0]?.sdgcountry?.name ?? "—"}
          </div>
        </section>

     
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Kpi
              title="Bevolking onder internationale armoedegrens"
              value={data1.datasets[0].data.at(-1)}
              previousValue={data1.datasets[0].data.at(-2)}
            />
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <BarChart data={data1} />
            </div>
          </div>

          <div className="space-y-4">
            <Kpi
              title="Werkenden onder de armoedegrens"
              value={data2.datasets[0].data.at(-1)}
              previousValue={data2.datasets[0].data.at(-2)}
            />
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <LineChart data={data2} />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
