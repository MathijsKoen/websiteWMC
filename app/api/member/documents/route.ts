import { getMemberDocuments } from '@/lib/contentful/queries'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Altijd verse data, geen CDN-cache

export async function GET() {
  try {
    const documents = await getMemberDocuments()
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json([], { status: 500 })
  }
}
