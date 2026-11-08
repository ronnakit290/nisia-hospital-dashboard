type BrandMarkProps = {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
}

const tileSize = {
  sm: 'size-9 rounded-[10px]',
  md: 'size-11 rounded-xl',
  lg: 'size-14 rounded-2xl',
}

const glyphSize = {
  sm: 'size-6',
  md: 'size-7',
  lg: 'size-9',
}

export function BrandMark({ size = 'md', onDark = false }: BrandMarkProps) {
  return (
    <span
      className={`grid shrink-0 place-items-center bg-white shadow-[0_6px_18px_-8px_rgba(0,0,0,0.45)] ${tileSize[size]}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className={glyphSize[size]} fill="none">
        <path
          d="M13.1 3.5h5.8v9.6h9.6v5.8h-9.6v9.6h-5.8v-9.6H3.5v-5.8h9.6V3.5Z"
          fill={onDark ? '#1d53d4' : '#1742ab'}
        />
        <path
          d="M7.6 16h4.2l2.1-3.9 3.2 8.4 2.2-4.5h5.3"
          stroke="#d92d3c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function BrandName({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="min-w-0">
      <span
        className={`block truncate text-[15px] font-bold leading-tight tracking-tight ${
          onDark ? 'text-white' : 'text-ink-900'
        }`}
      >
        โรงพยาบาลนิเซีย
      </span>
      <span
        className={`mt-0.5 block truncate text-[9.5px] font-semibold uppercase tracking-[0.16em] ${
          onDark ? 'text-white/45' : 'text-ink-400'
        }`}
      >
        Nisia General Hospital
      </span>
    </span>
  )
}
