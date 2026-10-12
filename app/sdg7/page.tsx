import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { prisma } from "@/lib/prisma";
import { Kpi } from "@/components/ui/Kpi";
import { FixedKpi } from "@/components/ui/FixedKpi";

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
            year: 'asc',
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

    console.log(countryId);

    const sdgData1 = await getSdgData(12, countryId);
    const data1 = prepareDataForGraph(sdgData1);
    const optionArray = await getSdgCountriesAsOptions();

    const lastValue = data1.datasets[0].data[data1.datasets[0].data.length - 1];
    const previousValue = data1.datasets[0].data[0];

    let trendText = "Geen verandering";

    if (lastValue > previousValue) {
        trendText = "Stijging";
    } else if (lastValue < previousValue) {
        trendText = "Daling";
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Extra Informatie Sectie */}
                <div className="bg-white p-8 rounded-lg shadow-2xl dark:bg-gray-800 dark:text-white mb-12">
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                        Wat zijn de SDG-doelen voor Betaalbare en Schone Energie?
                    </h2>
                    <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                        Het doel van SDG 7 (Betaalbare en Schone Energie) is om iedereen toegang te geven tot betrouwbare,
                        duurzame en moderne energiebronnen. Dit omvat het bevorderen van energie-efficiëntie, 
                        het gebruik van hernieuwbare energie en het verbeteren van energie-infrastructuren wereldwijd.
                    </p>
                    <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                        Dit dashboard toont de voortgang van SDG 7 per land, met een focus op de energie-infrastructuren en trends
                        in het gebruik van schone energie. Selecteer een land om de relevante gegevens en trends te bekijken.
                    </p>
                </div>

                {/* Hoofd Titel en Beschrijving */}
                <div className="text-center mt-12 space-y-4">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
                        Betaalbare en Schone Energie
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Bekijk de voortgang van SDG 7 in de energietransitie per land en ontdek de trends in de inzet van schone energie.
                    </p>
                </div>

                {/* Land Selectie Formulier */}
                <form method="GET" className="mt-8">
                    <div className="w-full sm:w-96 mx-auto">
                        <Select id="countryId" name="countryId" options={optionArray} />
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700">
                            Submit
                        </Button>
                    </div>
                </form>

                {/* Data Weergave Sectie */}
                <div className="mt-8 text-center">
                    {sdgData1.length > 0 && (
                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                            Data for country: {sdgData1[0]?.sdgcountry?.name}
                        </div>
                    )}
                </div>

                {/* KPI en Trend Sectie */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
                        <Kpi
                            title="Proportion of population with access to electricity, by urban/rural"
                            value={data1.datasets[0].data[data1.datasets[0].data.length - 1]}
                            previousValue={data1.datasets[0].data[0]}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
                        <FixedKpi title="Trend" value={trendText} />
                    </div>
                </div>

                {/* Grafieken Sectie */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
                        <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
                            Bar Chart: Energie Data
                        </h3>
                        <BarChart data={data1} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
                        <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
                            Line Chart: Energie Trends
                        </h3>
                        <LineChart data={data1} />
                    </div>
                </div>

            </div>
        </div>
    );
}
