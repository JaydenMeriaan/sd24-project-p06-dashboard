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

  const sdgData1 = await getSdgData(3, countryId);
  const sdgData2 = await getSdgData(4, countryId);

  const data1 = prepareDataForGraph(sdgData1);
  const data2 = prepareDataForGraph(sdgData2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-16">

        <section className="space-y-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 dark:text-green-300">
            SDG 2  Geen honger
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-300 max-w-3xl mx-auto">
            Een wereld zonder honger betekent meer dan genoeg voedsel.
            Het gaat over gezonde voeding, eerlijke landbouw en veerkrachtige
            voedselsystemen.
          </p>
        </section>

 
        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Waarom SDG 2 belangrijk is
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Miljoenen mensen wereldwijd hebben dagelijks te maken met
              ondervoeding. Honger belemmert niet alleen gezondheid, maar ook
              onderwijs, economische kansen en maatschappelijke stabiliteit.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              SDG 2 richt zich daarom op het hele voedselsysteem: van duurzame
              landbouw tot toegang tot voedzaam eten voor iedereen.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow space-y-4">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
              SDG 2 in het kort
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Honger en ondervoeding beëindigen</li>
              <li>Betere voeding voor iedereen</li>
              <li>Duurzame en inclusieve landbouw</li>
              <li>Meer weerbaarheid tegen klimaatverandering</li>
            </ul>
          </div>
        </section>

        
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            De kern van SDG 2
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                Geen honger
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Iedereen moet het hele jaar door toegang hebben tot voldoende
                en voedzaam voedsel.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                Betere voeding
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ondervoeding bij kinderen en kwetsbare groepen terugdringen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">
                Duurzame landbouw
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Landbouwsystemen die productief én milieuvriendelijk zijn.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            SDG 2 in cijfers
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
              title="Prevalentie van ondervoeding (%)"
              value={data1.datasets[0].data.at(-1)}
              previousValue={data1.datasets[0].data.at(-2)}
            />
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <BarChart data={data1} />
            </div>
          </div>

          <div className="space-y-4">
            <Kpi
              title="Aantal ondervoede mensen"
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
