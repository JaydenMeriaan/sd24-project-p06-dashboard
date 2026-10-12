import { notFound, redirect } from "next/navigation";
import { getSDGById } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { SDGDetailClient } from "./SDGDetailClient";

/**
 * Fetch SDG values for charts
 * Converts BigInt and Decimal safely for client use
 */
async function getSdgData() {
  const sdgData = await prisma.sdgvalue.findMany({
    where: {
      country_id: 130,
      serie_id: 5,
    },
    include: {
      sdgserie: true,
      sdgcountry: true,
    },
    orderBy: {
      year: "asc",
    },
  });

  // Convert BigInt and Decimal for client
  return sdgData.map((item) => ({
    id: item.id.toString(),
    year: item.year ?? null,
    value: item.value?.toNumber() ?? 0,
    sdgserie: item.sdgserie
      ? { description: item.sdgserie.description ?? null }
      : null,
    sdgcountry: item.sdgcountry ? { name: item.sdgcountry.name ?? null } : null,
  }));
}

/**
 * Original function to fetch metrics for the SDG detail page
 */
async function getSDGData(sdgNumber: number) {
  const metrics = await prisma.sdgMetric.findMany({
    where: { sdgNumber },
    orderBy: [{ year: "asc" }, { country: "asc" }],
  });

  return metrics;
}

/**
 * Static paths for implemented SDGs
 */
export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "7" },
    { id: "8" },
    { id: "10" },
    { id: "13" },
    { id: "14" },
    { id: "15" },
  ];
}

/**
 * Metadata for SDG page
 */
export async function generateMetadata({ params }: { params: { id: string } }) {
  const sdg = getSDGById(parseInt(params.id));

  if (!sdg) {
    return { title: "SDG Niet Gevonden" };
  }

  return {
    title: `SDG ${sdg.number}: ${sdg.title} | SDG Dashboard`,
    description: sdg.description,
  };
}

/**
 * SDG Detail Page with chart integration
 */
export default async function SDGDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const sdgNumber = parseInt(params.id);
  const sdg = getSDGById(sdgNumber);

  // If SDG does not exist or is not implemented, show 404
  if (!sdg || !sdg.implemented) {
    notFound();
  }

if (sdg.number === 1) {
  redirect('/sdg1');
} else if (sdg.number === 2) {
  redirect('/sdg2');
} else if (sdg.number === 3) {
  redirect('/sdg3');
} else if (sdg.number === 4) {
  redirect('/sdg4');
} else if (sdg.number === 5) {
  redirect('/sdg5');
} else if (sdg.number === 6) {
  redirect('/sdg6');
} else if (sdg.number === 7) {
  redirect('/sdg7');
} else if (sdg.number === 8) {
  redirect('/sdg8');
} else if (sdg.number === 9) {
  redirect('/sdg9');
} else if (sdg.number === 10) {
  redirect('/sdg10');
}


  // Fetch metrics for the SDG detail page
  const metrics = await getSDGData(sdgNumber);

  // Fetch chart data (dashboard style)
  const chartDataRaw = await getSdgData();

  const labels: string[] = [];
  const values: number[] = [];

  chartDataRaw.forEach((item) => {
    labels.push(item.year ? item.year.toString() : "-1");
    values.push(item.value);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: chartDataRaw[0]?.sdgserie?.description ?? "Onbekend",
        data: values,
        backgroundColor: "yellow",
        borderColor: "green",
        borderWidth: 3,
      },
    ],
  };

  return (
    <div>
      {/* Original SDG Detail Client component */}
      <SDGDetailClient
        sdg={sdg}
        metrics={metrics}
        chartData={chartData}
        chartDataRaw={chartDataRaw}
        isAuthenticated={false}
        isFavorite={false}
      />
    </div>
  );
}
