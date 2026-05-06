import { getSessionUser } from '@/lib/auth'
import { getMemberDocuments } from '@/lib/contentful/queries'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  try {
    const documents = await getMemberDocuments()
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json([], { status: 500 })
  }
}
