"use client"

import { useCallback, useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import { isValidImage, formatFileSize } from "@/lib/image-utils"

interface ImageUploaderProps {
  onFile: (file: File) => void
  accept?: string
  maxSizeMB?: number
  className?: string
}

export function ImageUploader({
  onFile,
  accept = "image/*",
  maxSizeMB = 50,
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const errorId = useId()

  const validateAndAccept = useCallback(
    (file: File) => {
      setError(null)
      if (!isValidImage(file)) {
        setError("不支持的图片格式，请上传 PNG、JPEG、WebP、BMP、GIF 等格式")
        return
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`文件大小超过限制（最大 ${maxSizeMB}MB）`)
        return
      }
      onFile(file)
    },
    [maxSizeMB, onFile]
  )

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      validateAndAccept(files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      validateAndAccept(files[0])
    }
    // Reset input so the same file can be re-uploaded
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        role="button"
        tabIndex={0}
        aria-describedby={error ? errorId : undefined}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center p-10 sm:p-16 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/30"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Upload icon */}
          <div
            className={cn(
              "flex items-center justify-center w-16 h-16 rounded-2xl transition-colors",
              isDragging
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-base font-medium">
              {isDragging ? "松开以上传图片" : "拖拽图片到此处，或点击上传"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              支持 PNG、JPEG、WebP、BMP、GIF 格式，最大 {maxSizeMB}MB
            </p>
          </div>
        </div>

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
        />
      </label>

      {error && (
        <p id={errorId} role="alert" className="mt-3 text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  )
}

interface ImageUploaderWithPreviewProps extends ImageUploaderProps {
  previewSize?: "sm" | "md" | "lg"
}

export function ImageUploaderWithPreview({
  onFile,
  accept,
  maxSizeMB,
  className,
}: ImageUploaderWithPreviewProps) {
  const [preview, setPreview] = useState<{ url: string; name: string; size: number } | null>(null)

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview.url)
  }, [preview])

  const handleFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file)
      setPreview({ url, name: file.name, size: file.size })
      onFile(file)
    },
    [onFile]
  )

  if (preview) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="relative rounded-xl overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.url}
            alt="Preview"
            className="max-h-64 w-full object-contain"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate">{preview.name}</span>
            <span className="text-muted-foreground shrink-0">
              {formatFileSize(preview.size)}
            </span>
          </div>
          <button
            onClick={() => setPreview(null)}
            aria-label="移除已上传的图片"
            className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <ImageUploader
      onFile={handleFile}
      accept={accept}
      maxSizeMB={maxSizeMB}
      className={className}
    />
  )
}
