import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const querySchema = z.object({
  sdg: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().positive().optional()),
  metricKey: z.string().optional(),
  country: z.string().optional(),
  from: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().optional()),
  to: z.preprocess((v) => (v ? Number(v) : undefined), z.number().int().optional()),
})

const createMetricSchema = z.object({
  sdgNumber: z.number().int().positive(),
  country: z.string(),
  year: z.number().int(),
  metricKey: z.string(),
  value: z.number().nullable().optional(),
  source: z.string().nullable().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())
    const parsed = querySchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.flatten() }, { status: 400 })
    }

    const where: any = {}
    if (parsed.data.sdg !== undefined) where.sdgNumber = parsed.data.sdg
    if (parsed.data.metricKey) where.metricKey = parsed.data.metricKey
    if (parsed.data.country) where.country = parsed.data.country
    if (parsed.data.from !== undefined || parsed.data.to !== undefined) {
      where.year = {}
      if (parsed.data.from !== undefined) where.year.gte = parsed.data.from
      if (parsed.data.to !== undefined) where.year.lte = parsed.data.to
    }

    const metrics = await prisma.sdgMetric.findMany({
      where,
      orderBy: [{ year: 'asc' }, { country: 'asc' }],
    })

    return NextResponse.json({ success: true, count: metrics.length, data: metrics })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createMetricSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 })
    }

    const created = await prisma.sdgMetric.create({ data: parsed.data })

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    console.error('Error creating metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


