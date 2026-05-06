'use client'

import { FileText, AlertCircle, Calendar, Search, Filter, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { MemberAnnouncement, MemberDocument } from '@/lib/contentful/types'
import DeclarationForm from './DeclarationForm'

interface MemberPortalProps {
  announcements: MemberAnnouncement[]
  documents: MemberDocument[]
}

export default function MemberPortal({ announcements, documents }: MemberPortalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null)
  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    () => new Set([new Date().getFullYear()])
  )
  const [activeTab, setActiveTab] = useState<'documenten' | 'declaratie'>('documenten')

  // Labels voor categorieën
  const categoryLabels: Record<string, string> = {
    jaarverslag: 'Jaarverslagen',
    begroting: 'Begrotingen',
    notulen: 'Vergadernotulen',
    financieel: 'Financiële Stukken',
    overig: 'Overige Documenten',
  }

  // Filter documenten op zoekterm en categorie
  const filteredDocuments = useMemo(() => {
    let filtered = documents

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(term) ||
          doc.description?.toLowerCase().includes(term)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((doc) => doc.category === selectedCategory)
    }

    return filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }, [documents, searchTerm, selectedCategory])

  // Groepeer gefilterde documenten per jaar (automatisch op basis van uploadedAt)
  const documentsByYear = useMemo(() => {
    const grouped: Record<number, MemberDocument[]> = {}
    filteredDocuments.forEach((doc) => {
      const year = new Date(doc.uploadedAt).getFullYear()
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(doc)
    })
    return grouped
  }, [filteredDocuments])

  const sortedYears = useMemo(
    () => Object.keys(documentsByYear).map(Number).sort((a, b) => b - a),
    [documentsByYear]
  )

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'hoog':
        return 'bg-red-50 border-l-red-500'
      case 'laag':
        return 'bg-blue-50 border-l-blue-500'
      default:
        return 'bg-yellow-50 border-l-yellow-500'
    }
  }

  const getPriorityBadgeColor = (priority?: string) => {
    switch (priority) {
      case 'hoog':
        return 'bg-red-100 text-red-800'
      case 'laag':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE'
  }

  return (
    <div className="space-y-8">
      {/* MEDEDELINGEN SECTIE */}
      {announcements.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
              <AlertCircle size={22} className="text-[#cc0000]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1c1c]">Mededelingen</h2>
          </div>

          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`border-l-4 rounded-r-lg transition cursor-pointer hover:shadow-md ${getPriorityColor(announcement.priority)}`}
              >
                <div
                  onClick={() =>
                    setExpandedAnnouncement(
                      expandedAnnouncement === announcement.id ? null : announcement.id
                    )
                  }
                  className="p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#1a1c1c] leading-tight">
                        {announcement.title}
                      </h3>
                      {announcement.priority && (
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${getPriorityBadgeColor(announcement.priority)}`}
                        >
                          {announcement.priority === 'hoog' && '⚠️ Belangrijk'}
                          {announcement.priority === 'normaal' && '📌 Normaal'}
                          {announcement.priority === 'laag' && 'ℹ️ Informatief'}
                        </span>
                      )}
                    </div>
                    {expandedAnnouncement === announcement.id && (
                      <p className="text-gray-700 leading-relaxed mt-3">{announcement.content}</p>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-3 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(announcement.publishedAt)}
                  </div>
                  <span className="text-xs">
                    {expandedAnnouncement === announcement.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TABS: Documenten / Declaratie */}
      <section>
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('documenten')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
              activeTab === 'documenten'
                ? 'border-[#cc0000] text-[#cc0000]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={16} />
            Documenten
          </button>
          <button
            onClick={() => setActiveTab('declaratie')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
              activeTab === 'declaratie'
                ? 'border-[#cc0000] text-[#cc0000]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardList size={16} />
            Declaratie indienen
          </button>
        </div>

        {/* DOCUMENTEN TAB */}
        {activeTab === 'documenten' && (
          <>
            {documents.length > 0 ? (
              <>
                {/* Search & Filter Bar */}
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoeken in documenten..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent transition"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Filter size={16} className="text-gray-600 ml-1" />
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedCategory === 'all'
                          ? 'bg-[#cc0000] text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-[#cc0000]'
                      }`}
                    >
                      Alle
                    </button>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleCategoryChange(key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedCategory === key
                            ? 'bg-[#cc0000] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-[#cc0000]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Documenten per jaar */}
                {sortedYears.length > 0 ? (
                  <div className="space-y-3">
                    {sortedYears.map((year) => (
                      <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Jaar-header (klikbaar) */}
                        <button
                          onClick={() => toggleYear(year)}
                          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-[#1a1c1c]">{year}</span>
                            <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                              {documentsByYear[year].length} document{documentsByYear[year].length !== 1 ? 'en' : ''}
                            </span>
                          </div>
                          {expandedYears.has(year)
                            ? <ChevronUp size={18} className="text-gray-400" />
                            : <ChevronDown size={18} className="text-gray-400" />
                          }
                        </button>

                        {/* Documenten in dit jaar */}
                        {expandedYears.has(year) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {documentsByYear[year].map((doc) => (
                              <a
                                key={doc.id}
                                href={doc.file.fields.file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-5 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#cc0000] transition group flex flex-col h-full"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="w-12 h-12 bg-[#cc0000] rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {getFileExtension(doc.file.fields.file.fileName)}
                                  </div>
                                  <span className="text-xs text-gray-500 group-hover:text-[#cc0000] font-medium bg-gray-100 px-2.5 py-1.5 rounded">
                                    {(doc.file.fields.file.details.size / 1024 / 1024).toFixed(1)} MB
                                  </span>
                                </div>
                                <h4 className="font-semibold text-[#1a1c1c] group-hover:text-[#cc0000] transition mb-2 line-clamp-2 flex-1">
                                  {doc.title}
                                </h4>
                                {doc.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{doc.description}</p>
                                )}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar size={12} />
                                    {formatDate(doc.uploadedAt)}
                                  </div>
                                  <span className="text-[#cc0000] group-hover:translate-x-1 transition">→</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600">
                      {searchTerm ? 'Geen documenten gevonden met deze zoekterm.' : 'Geen documenten beschikbaar in deze categorie.'}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600">Er zijn nog geen documenten geüpload.</p>
              </div>
            )}
          </>
        )}

        {/* DECLARATIE TAB */}
        {activeTab === 'declaratie' && <DeclarationForm />}
      </section>

      {/* Empty State (geen mededelingen én geen documenten) */}
      {announcements.length === 0 && documents.length === 0 && activeTab === 'documenten' && (
        <div className="text-center py-16">
          <AlertCircle size={56} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Geen inhoud beschikbaar</h3>
          <p className="text-gray-500">Er zijn momenteel geen mededelingen of documenten beschikbaar.</p>
        </div>
      )}
    </div>
  )
}
