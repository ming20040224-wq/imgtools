interface LogoProps {
  className?: string
}

/** 方案一：Pixel Prism — 像素棱镜，简洁几何 */
export function LogoPrism({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="prism-grad" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path
        d="M18 2L33 12V24L18 34L3 24V12L18 2Z"
        fill="url(#prism-grad)"
        opacity="0.9"
      />
      <path
        d="M18 10L27 15V21L18 26L9 21V15L18 10Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <rect x="15" y="16" width="6" height="6" rx="1" fill="white" />
    </svg>
  )
}

/** 方案二：Pixel Dots — 四点像素，极简识别 */
export function LogoDots({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dots-grad-1" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="dots-grad-2" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="13" height="13" rx="3" fill="url(#dots-grad-1)" />
      <rect x="20" y="3" width="13" height="13" rx="3" fill="url(#dots-grad-1)" />
      <rect x="3" y="20" width="13" height="13" rx="3" fill="url(#dots-grad-2)" />
      <rect x="20" y="20" width="13" height="13" rx="3" fill="#ec4899" />
    </svg>
  )
}

/** 方案三：Letter P — 字母 P 变体，品牌感 */
export function LogoLetter({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="letter-grad" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect x="5" y="3" width="10" height="30" rx="5" fill="url(#letter-grad)" />
      <path
        d="M15 3H23C28.5 3 30 8 30 11C30 14 28.5 18 23 18H15"
        fill="url(#letter-grad)"
      />
      <rect x="17" y="6" width="10" height="9" rx="4" fill="white" opacity="0.3" />
    </svg>
  )
}

/** 默认导出 — 推荐方案二 */
export default function Logo({ className }: LogoProps) {
  return <LogoDots className={className} />
}
