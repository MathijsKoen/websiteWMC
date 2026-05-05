import { getMemberAnnouncements } from '@/lib/contentful/queries'
import { NextResponse } from 'next/server'

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    const announcements = await getMemberAnnouncements()
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json([], { status: 500 })
  }
}
