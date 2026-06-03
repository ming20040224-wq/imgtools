import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ToolLayoutProps {
  title: string
  titleZh: string
  description: string
  descriptionZh: string
  children: React.ReactNode
}

export function ToolLayout({
  title,
  titleZh,
  description,
  descriptionZh,
  children,
}: ToolLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          首页
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{titleZh}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {titleZh}
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            {title}
          </span>
        </h1>
        <p className="text-muted-foreground">{descriptionZh}</p>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}

export function DownloadButton({
  onClick,
  disabled,
  label = "下载处理后的图片",
}: {
  onClick: () => void
  disabled?: boolean
  label?: string
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="w-full sm:w-auto rounded-xl bg-gradient-brand text-white shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all h-12 px-8"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </Button>
  )
}
