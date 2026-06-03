"use client"

import { useState, useCallback, useRef } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { ImagePreview } from "@/components/ImagePreview"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { compressImage, compressImages, formatFileSize, getFileSizeKB } from "@/lib/image-utils"
import type { Metadata } from "next"

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([])
  const [processed, setProcessed] = useState<Blob[]>([])
  const [compressing, setCompressing] = useState(false)
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles)
    setFiles((prev) => [...prev, ...arr])
  }, [])

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
    setProcessed([])
  }

  const handleCompress = async () => {
    if (files.length === 0) return
    setCompressing(true)
    try {
      const results = await compressImages(files, {
        quality: quality / 100,
        maxWidthOrHeight: maxWidth,
        maxSizeMB: 999,
      })
      setProcessed(results.map((r) => new Blob([r], { type: r.type })))
    } catch (e) {
      console.error("Compression failed:", e)
    } finally {
      setCompressing(false)
    }
  }

  const handleDownload = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `compressed_${name}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalBefore = files.reduce((s, f) => s + f.size, 0)
  const totalAfter = processed.reduce((s, b) => s + b.size, 0)

  return (
    <ToolLayout
      title="Image Compress"
      titleZh="图片压缩"
      description="Reduce image file size while maintaining quality"
      descriptionZh="减小图片文件大小，同时尽可能保持画质"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upload & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground mb-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-sm font-medium">点击或拖拽上传</p>
                <p className="text-xs text-muted-foreground mt-1">支持批量</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardContent className="p-4 space-y-5">
              <h3 className="font-semibold">⚙️ 压缩设置</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">画质</label>
                  <span className="text-sm text-muted-foreground">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={([v]) => setQuality(v)}
                  min={10}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>更小文件</span>
                  <span>更高画质</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">最大宽度</label>
                  <span className="text-sm text-muted-foreground">{maxWidth}px</span>
                </div>
                <Slider
                  value={[maxWidth]}
                  onValueChange={([v]) => setMaxWidth(v)}
                  min={480}
                  max={5120}
                  step={80}
                />
              </div>

              <button
                onClick={handleCompress}
                disabled={files.length === 0 || compressing}
                className="w-full rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {compressing ? "压缩中..." : `压缩 ${files.length} 张图片`}
              </button>
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">文件列表 ({files.length})</h3>
                  {processed.length > 0 && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      共节省 {((1 - totalAfter / totalBefore) * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg hover:bg-muted/50">
                      <span className="truncate flex-1 min-w-0 mr-2">{f.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatFileSize(f.size)}
                        {processed[i] && (
                          <span className="text-green-600 dark:text-green-400 ml-2">
                            → {formatFileSize(processed[i].size)}
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => removeFile(i)}
                        className="ml-2 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                {processed.length > 0 && (
                  <button
                    onClick={() => processed.forEach((b, i) => handleDownload(b, files[i]?.name ?? `image_${i}`))}
                    className="w-full mt-3 rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg transition-all"
                  >
                    下载全部 ({processed.length} 张)
                  </button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 sm:p-6">
              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-40">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p>上传图片后开始压缩</p>
                </div>
              ) : files.length === 1 ? (
                <ImagePreview
                  beforeFile={files[0]}
                  afterBlob={processed[0] ?? null}
                  beforeLabel="原图"
                  afterLabel="压缩后"
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    已选择 {files.length} 张图片，点击左侧"压缩"按钮开始
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden bg-muted aspect-square">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                          className="w-full h-full object-cover"
                          onLoad={(e) => {
                            // Revoke after load
                            const img = e.target as HTMLImageElement
                            setTimeout(() => URL.revokeObjectURL(img.src), 100)
                          }}
                        />
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                          {formatFileSize(f.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}
