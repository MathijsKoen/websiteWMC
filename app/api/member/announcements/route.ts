import { getMemberAnnouncements } from '@/lib/contentful/queries'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Altijd verse data, geen CDN-cache

export async function GET() {
  try {
    const announcements = await getMemberAnnouncements()
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json([], { status: 500 })
  }
}
