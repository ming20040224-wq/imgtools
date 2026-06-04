interface LogoProps {
  className?: string
}

/** 方案一：Camera Aperture — 相机光圈，图片处理专属符号 */
export function LogoAperture({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ap-grad" x1="4" y1="4" x2="36" y2="36">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="ap-inner" x1="12" y1="12" x2="28" y2="28">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="20" cy="20" r="17" stroke="url(#ap-grad)" strokeWidth="3" />
      {/* Aperture blades */}
      <path d="M20 6L27 12L26 20L20 26L14 20L13 12L20 6Z" fill="url(#ap-grad)" opacity="0.9" />
      <path d="M27 12L32 18L30 24L26 20L20 14L27 12Z" fill="url(#ap-grad)" opacity="0.7" />
      <path d="M8 18L13 12L20 14L14 20L10 24L8 18Z" fill="url(#ap-grad)" opacity="0.7" />
      <path d="M14 28L14 20L20 26L26 28L20 34L14 28Z" fill="url(#ap-grad)" opacity="0.65" />
      {/* Center dot */}
      <circle cx="20" cy="20" r="4" fill="white" />
      <circle cx="20" cy="20" r="2.5" fill="url(#ap-inner)" />
    </svg>
  )
}

/** 方案二：Spectrum Ring — 光谱圆环，现代极简 */
export function LogoSpectrum({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spec-1" x1="0" y1="20" x2="40" y2="20">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="spec-2" x1="20" y1="0" x2="20" y2="40">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {/* Outer glow */}
      <circle cx="20" cy="20" r="17" fill="#1e1b4b" />
      <circle cx="20" cy="20" r="15" stroke="url(#spec-1)" strokeWidth="5" fill="none" />
      <circle cx="20" cy="20" r="15" stroke="url(#spec-2)" strokeWidth="5" fill="none" strokeDasharray="8 4" />
      {/* Inner P letter */}
      <text x="20" y="25.5" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">P</text>
    </svg>
  )
}

/** 方案三：Prism Cube — 立体像素方块，代表 Pixel 本源 */
export function LogoCube({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cube-top" x1="4" y1="6" x2="36" y2="18">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="cube-left" x1="4" y1="16" x2="18" y2="32">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="cube-right" x1="36" y1="14" x2="22" y2="30">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* Top face */}
      <path d="M20 4L34 12L20 20L6 12L20 4Z" fill="url(#cube-top)" />
      {/* Left face */}
      <path d="M6 12L20 20L20 32L6 24L6 12Z" fill="url(#cube-left)" />
      {/* Right face */}
      <path d="M20 20L34 12L34 24L20 32L20 20Z" fill="url(#cube-right)" />
      {/* Highlight */}
      <path d="M12 16L20 20L20 28L12 24L12 16Z" stroke="white" strokeWidth="0.8" opacity="0.15" fill="none" />
    </svg>
  )
}

/** 方案四：Waveform — 音波/色波，动态优雅 */
export function LogoWave({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wave-grad" x1="4" y1="4" x2="36" y2="36">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="33%" stopColor="#a855f7" />
          <stop offset="66%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="20" cy="20" r="16" fill="#0f0a1a" stroke="url(#wave-grad)" strokeWidth="1.5" />
      {/* Wave lines */}
      <path d="M4 28Q10 20 14 26Q18 32 22 24Q26 16 30 22Q34 28 36 24" stroke="url(#wave-grad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M4 22Q10 14 14 20Q18 26 22 18Q26 10 30 16Q34 22 36 18" stroke="url(#wave-grad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M4 16Q10 8 14 14Q18 20 22 12Q26 4 30 10Q34 16 36 12" stroke="url(#wave-grad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** 默认：Aperture（推荐） */
export default function Logo({ className }: LogoProps) {
  return <LogoAperture className={className} />
}
