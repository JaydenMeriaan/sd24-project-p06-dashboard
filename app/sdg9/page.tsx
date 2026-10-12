import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { prisma } from "@/lib/prisma";


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
//hieronder moeten  de datanummers veranderen naar de juiste nummers die kun je vinden in de sdg series in de database.
 

  const sdgData1 = await getSdgData(14, countryId);
  const data1 = prepareDataForGraph(sdgData1); //stel de sdg heeft 2 indexes dan moet er een sdgData2 komen


  //en dan moet er bij de 2de chart sdgData 2 komen in plaats van sdgData1 .

 
  const sdgData2 = await getSdgData(15, countryId);
    const data2 = prepareDataForGraph(sdgData2);

   const sdgData3 = await getSdgData(16, countryId);
   const data3 = prepareDataForGraph(sdgData3);

   //stel de sdg heeft 2 indexes dan moet er een sdgData2 komen
  //en dan moet er bij de 2de chart sdgData 2 komen in plaats van sdgData1 .

  //Dus bij 2 indexes :    //
  // const sdgData2 = await getSdgData(indexnummer, countryId);
  // const data2 = prepareDataForGraph(sdgData2);


  const optionArray = await getSdgCountriesAsOptions();

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">

            Klimaatactie

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
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <BarChart 
                data={data1}
              ></BarChart>
            </div>
            <div>
              <LineChart

                data={data2} //hier komt dan {data2} te staan ipv {data1}
              ></LineChart>
            </div>
             <div>
              <LineChart
                data={data3} //hier komt dan {data3} te staan ipv {data1}

              ></LineChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

