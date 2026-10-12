'use client'

import { useState, useMemo } from 'react'
import { SDGInfo, SDGMetric } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart } from '@/components/charts/BarChart'  // Import BarChart component

interface ChartDataRaw {
  id: string
  year: number | null
  value: number
  sdgserie: { description: string | null } | null
  sdgcountry: { name: string | null } | null
}

interface SDGDetailClientProps {
  sdg: SDGInfo
  metrics: SDGMetric[]
  chartData?: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
    }>
  }
  chartDataRaw?: ChartDataRaw[]
  isAuthenticated: boolean
  isFavorite: boolean
}

export function SDGDetailClient({
  sdg,
  metrics,
  chartData: propsChartData,
  chartDataRaw,
  isAuthenticated,
  isFavorite,
}: SDGDetailClientProps) {
  // Implement filter state
  const [filters, setFilters] = useState<{
    country?: string
    from?: number
    to?: number
  }>({})

  // Filter metrics based on selected filters
  const filteredMetrics = useMemo(() => {
    let filtered = metrics
    
    // Add filtering logic here (country, year range, etc.)
    if (filters.country) {
      filtered = filtered.filter(m => m.country === filters.country)
    }
    if (filters.from !== undefined) {
      filtered = filtered.filter(m => m.year >= filters.from!)
    }
    if (filters.to !== undefined) {
      filtered = filtered.filter(m => m.year <= filters.to!)
    }

    return filtered
  }, [metrics, filters])

  // Prepare data for the BarChart from SDGMetric
  const metricsChartData = useMemo(() => {
    const years = [...new Set(filteredMetrics.map((metric) => metric.year))].sort() // Get unique years and sort
    const values = years.map((year) => {
      const metric = filteredMetrics.find((m) => m.year === year)
      // If metric exists, use the value, otherwise default to 0
      return metric ? (metric.value ?? 0) : 0
    })

    return {
      labels: years.map(String), // Convert years to strings for labels
      datasets: [
        {
          label: `SDG ${sdg.number} - Trend over Years`,
          data: values as number[], // Ensure no null values
          backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Chart background color
          borderColor: 'rgba(75, 192, 192, 1)',      // Chart border color
          borderWidth: 1,
        },
      ],
    }
  }, [filteredMetrics, sdg.number])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            {/* SDG Icon */}
            <div
              className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl flex-shrink-0"
              style={{ backgroundColor: sdg.color }}
            >
              {sdg.icon}
            </div>
            
            {/* SDG Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                SDG {sdg.number}: {sdg.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {sdg.description}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Section */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-8 text-center text-b-500">
              <p>TODO: Implement KPI cards</p>
              <p className="text-sm mt-2">Show 4 key statistics with trends</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        {/* TODO: Implement FilterBar component */}
        {/* <div className="mb-8">
          <FilterBar onFilterChange={setFilters} />
        </div> */}

     {/* Full-width Charts Section - only show if there's data */}
{filteredMetrics.length > 0 && (
  <div className="w-full px-6 lg:px-12 mb-8">
    <Card className="max-w-none">
      <CardContent className="p-8">
        <h2 className="text-lg font-semibold mb-6 text-center">
          Trend Analysis of SDG {sdg.number}
        </h2>

        <div className="w-full">
          <BarChart
            data={metricsChartData}
            title={`SDG ${sdg.number} - Trend`}
            height={400}
          />
        </div>

        <p className="text-sm mt-4 text-center text-gray-500">
          Available Data: {filteredMetrics.length} metrics
        </p>
      </CardContent>
    </Card>
  </div>
)}

{/* Dashboard Chart Section - if chart data is provided */}
{propsChartData && (
  <div className="w-full px-6 lg:px-12 mb-8">
    <Card className="max-w-none">
      <CardContent className="p-8">
        <h2 className="text-lg font-semibold mb-6 text-center">
          Trend Chart for {chartDataRaw?.[0]?.sdgcountry?.name ?? 'Country'}
        </h2>

        <div className="w-full">
          <BarChart
            data={propsChartData}
            height={400}
          />
        </div>
      </CardContent>
    </Card>
  </div>
)}


        {/* Data Table */}
        {/* TODO: Implement data table with Table component */}
        {/* <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Data Table</h3>
              <Table data={filteredMetrics} columns={[...]} enableExport />
            </CardContent>
          </Card>
        </div> */}

        {/* Debug Info */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
              <p className="text-sm text-yellow-300">Total metrics: {metrics.length}</p>
              <p className="text-sm text-yellow-300">Filtered metrics: {filteredMetrics.length}</p>
              {metrics.length > 0 && (
                <>
                  <p className="text-sm text-gray-600 mt-2">
                    First metric: {JSON.stringify(metrics[0])}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Available metric keys: {[...new Set(metrics.map(m => m.metricKey))].join(', ')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
