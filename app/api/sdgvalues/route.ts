import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())
    const serie = params.serie ? Number(params.serie) : undefined
    const countryName = params.countryName
    const countryId = params.countryId ? Number(params.countryId) : undefined

    if (!serie) {
      return NextResponse.json({ error: 'Missing serie parameter' }, { status: 400 })
    }

    const where: any = { serie_id: serie }

    if (countryId) {
      where.country_id = countryId
    } else if (countryName) {
     
      where.sdgcountry = { is: { name: countryName } }
    }

    const rows = await prisma.sdgvalue.findMany({
      where,
      include: { sdgserie: true, sdgcountry: true },
      orderBy: { year: 'asc' },
    })


    const data = rows.map((r) => ({
      id: r.id !== undefined && r.id !== null ? String(r.id) : null,
      year: r.year,
      value: r.value !== null && r.value !== undefined ? Number(r.value) : null,
      serie: r.sdgserie?.description ?? null,
      source: r.sdgserie?.source ?? null,
      country: r.sdgcountry?.name ?? null,
    }))

    
    function sanitizeValue(v: any): any {
      if (typeof v === 'bigint') return v.toString()
      if (Array.isArray(v)) return v.map(sanitizeValue)
      if (v && typeof v === 'object') {
        const out: any = {}
        for (const [k, val] of Object.entries(v)) {
          out[k] = sanitizeValue(val)
        }
        return out
      }
      return v
    }

    const safeData = sanitizeValue({ success: true, count: data.length, data })

    return NextResponse.json(safeData)
  } catch (error) {
    console.error('Error in sdgvalues route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
