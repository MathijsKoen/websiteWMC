export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Geanimeerde spoorrails */}
        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-8 bg-[#cc0000] rounded-sm animate-pulse"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">
          Laden…
        </span>
      </div>
    </div>
  )
}
