"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { formatFileSize } from "@/lib/image-utils"

interface ImagePreviewProps {
  beforeFile: File | null
  afterBlob: Blob | null
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function ImagePreview({
  beforeFile,
  afterBlob,
  beforeLabel = "原图",
  afterLabel = "处理后",
  className,
}: ImagePreviewProps) {
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null)
  const [afterUrl, setAfterUrl] = useState<string | null>(null)

  useEffect(() => {
    if (beforeFile) {
      const url = URL.createObjectURL(beforeFile)
      setBeforeUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setBeforeUrl(null)
  }, [beforeFile])

  useEffect(() => {
    if (afterBlob) {
      const url = URL.createObjectURL(afterBlob)
      setAfterUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setAfterUrl(null)
  }, [afterBlob])

  if (!beforeUrl) {
    return <p className="text-center text-muted-foreground py-16">请先上传一张图片</p>
  }

  if (!afterUrl) {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt="Original"
          className="max-h-[400px] rounded-xl object-contain"
        />
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{beforeLabel}</span>
          {beforeFile && <span>{formatFileSize(beforeFile.size)}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <ComparisonSlider
        beforeUrl={beforeUrl}
        afterUrl={afterUrl}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />
      <div className="flex items-center justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-muted-foreground/40" />
          <span className="text-muted-foreground">{beforeLabel}</span>
          {beforeFile && (
            <span className="font-medium">{formatFileSize(beforeFile.size)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">{afterLabel}</span>
          {afterBlob && (
            <span className="font-medium">{formatFileSize(afterBlob.size)}</span>
          )}
        </div>
        {beforeFile && afterBlob && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            {beforeFile.size > afterBlob.size
              ? `减少了 ${((1 - afterBlob.size / beforeFile.size) * 100).toFixed(0)}%`
              : `增加了 ${((afterBlob.size / beforeFile.size - 1) * 100).toFixed(0)}%`}
          </span>
        )}
      </div>
    </div>
  )
}

function ComparisonSlider({
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
}: {
  beforeUrl: string
  afterUrl: string
  beforeLabel: string
  afterLabel: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const pct = (x / rect.width) * 100
      setSliderPosition(Math.max(0, Math.min(100, pct)))
    },
    []
  )

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      handleMove(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      handleMove(e.touches[0].clientX)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, handleMove])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl bg-muted select-none"
      style={{ aspectRatio: "16/10" }}
    >
      {/* Before (full) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeUrl}
        alt="Before"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* After (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt="After"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ width: containerRef.current ? `${(100 / sliderPosition) * 100}%` : "auto" }}
        />
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-400">
            <line x1="8" y1="6" x2="16" y2="12" />
            <line x1="16" y1="6" x2="8" y2="12" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 text-xs font-medium bg-black/50 text-white px-2 py-1 rounded-md">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 text-xs font-medium bg-primary/80 text-white px-2 py-1 rounded-md">
        {afterLabel}
      </span>
    </div>
  )
}
