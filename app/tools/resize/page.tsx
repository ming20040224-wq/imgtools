"use client"

import { useState } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { ImagePreview } from "@/components/ImagePreview"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { resizeImage, formatFileSize } from "@/lib/image-utils"

export default function ResizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [lockAspect, setLockAspect] = useState(true)
  const [percentage, setPercentage] = useState(100)
  const [processed, setProcessed] = useState<Blob | null>(null)
  const [resizing, setResizing] = useState(false)

  const handleFile = (f: File) => {
    setFile(f)
    setProcessed(null)
    const img = new Image()
    img.onload = () => {
      setImage(img)
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
    }
    img.src = URL.createObjectURL(f)
  }

  const handleWidthChange = (w: number) => {
    setWidth(w)
    if (lockAspect && image) {
      setHeight(Math.round(w * (image.naturalHeight / image.naturalWidth)))
    }
  }

  const handleHeightChange = (h: number) => {
    setHeight(h)
    if (lockAspect && image) {
      setWidth(Math.round(h * (image.naturalWidth / image.naturalHeight)))
    }
  }

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct)
    if (image) {
      setWidth(Math.round(image.naturalWidth * pct / 100))
      setHeight(Math.round(image.naturalHeight * pct / 100))
    }
  }

  const handleResize = async () => {
    if (!file || !width || !height) return
    setResizing(true)
    try {
      const result = await resizeImage(file, {
        width,
        height,
        maintainAspectRatio: false,
      })
      setProcessed(new Blob([result], { type: result.type }))
    } catch (e) {
      console.error("Resize failed:", e)
    } finally {
      setResizing(false)
    }
  }

  const handleDownload = () => {
    if (!processed || !file) return
    const url = URL.createObjectURL(processed)
    const a = document.createElement("a")
    a.href = url
    a.download = `resized_${file.name}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Image Resize"
      titleZh="调整大小"
      description="Resize images by pixels or percentage"
      descriptionZh="按像素或百分比调整图片尺寸"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={handleFile} />
              {image && (
                <p className="text-xs text-muted-foreground">
                  原始尺寸：{image.naturalWidth} × {image.naturalHeight} px
                </p>
              )}
            </CardContent>
          </Card>

          {image && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">📐 调整尺寸</h3>

                {/* Percentage */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">按百分比</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={10}
                      max={200}
                      value={percentage}
                      onChange={(e) => handlePercentageChange(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm w-12 text-right">{percentage}%</span>
                  </div>
                </div>

                {/* Width */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">宽度 (px)</label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    min={1}
                    max={10000}
                  />
                </div>

                {/* Lock */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLockAspect(!lockAspect)}
                    className={`p-1 rounded transition-colors ${
                      lockAspect ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {lockAspect ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {lockAspect ? "已锁定宽高比" : "自由调整"}
                  </span>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">高度 (px)</label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    min={1}
                    max={10000}
                  />
                </div>

                <button
                  onClick={handleResize}
                  disabled={!width || !height || resizing}
                  className="w-full rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {resizing ? "处理中..." : `调整为 ${width} × ${height}`}
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 sm:p-6">
              {!file ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-40">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p>上传图片开始调整大小</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImagePreview
                    beforeFile={file}
                    afterBlob={processed}
                    beforeLabel={`原图 ${image?.naturalWidth ?? "?"}×${image?.naturalHeight ?? "?"}`}
                    afterLabel={processed ? `${width}×${height}` : "处理后"}
                  />
                  {processed && (
                    <div className="flex justify-center">
                      <DownloadButton onClick={handleDownload} />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}
