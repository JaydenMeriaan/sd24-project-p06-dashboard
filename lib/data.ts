import sdgInfoData from '@/data/sdg-info.json'
import { SDGInfo, SDGMetric, FilterOptions } from './types'

export function getAllSDGs(): SDGInfo[] {
  return sdgInfoData as SDGInfo[]
}

export function getSDGById(id: number): SDGInfo | undefined {
  return sdgInfoData.find((sdg) => sdg.number === id) as SDGInfo | undefined
}

export function getImplementedSDGs(): SDGInfo[] {
  return sdgInfoData.filter((sdg) => sdg.implemented) as SDGInfo[]
}

export function filterMetrics(
  metrics: SDGMetric[],
  filters: FilterOptions
): SDGMetric[] {
  let filtered = metrics

  if (filters.goal) {
    filtered = filtered.filter((m) => m.sdgNumber === filters.goal)
  }

  if (filters.country) {
    filtered = filtered.filter((m) => m.country === filters.country)
  }

  if (filters.from) {
    filtered = filtered.filter((m) => m.year >= filters.from!)
  }

  if (filters.to) {
    filtered = filtered.filter((m) => m.year <= filters.to!)
  }

  return filtered
}

export function groupMetricsByYear(metrics: SDGMetric[]): Record<number, SDGMetric[]> {
  return metrics.reduce((acc, metric) => {
    if (!acc[metric.year]) {
      acc[metric.year] = []
    }
    acc[metric.year].push(metric)
    return acc
  }, {} as Record<number, SDGMetric[]>)
}

export function groupMetricsByCountry(metrics: SDGMetric[]): Record<string, SDGMetric[]> {
  return metrics.reduce((acc, metric) => {
    if (!acc[metric.country]) {
      acc[metric.country] = []
    }
    acc[metric.country].push(metric)
    return acc
  }, {} as Record<string, SDGMetric[]>)
}

export function calculateAverage(values: (number | null)[]): number {
  const validValues = values.filter((v) => v !== null) as number[]
  if (validValues.length === 0) return 0
  return validValues.reduce((sum, v) => sum + v, 0) / validValues.length
}

export function formatMetricValue(value: number | null, unit?: string): string {
  if (value === null) return 'N/A'
  const formatted = value.toFixed(2)
  return unit ? `${formatted}${unit}` : formatted
}

export function calculateTrend(
  current: number | null,
  previous: number | null
): 'up' | 'down' | 'stable' {
  if (current === null || previous === null) return 'stable'
  const diff = current - previous
  if (Math.abs(diff) < 0.01) return 'stable'
  return diff > 0 ? 'up' : 'down'
}

