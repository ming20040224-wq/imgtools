"use client"

import { useState, useCallback } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { ImagePreview } from "@/components/ImagePreview"
import { Card, CardContent } from "@/components/ui/card"
import { getFormatExtension, convertImage, formatFileSize } from "@/lib/image-utils"
import type { ImageFormat } from "@/lib/image-utils"

const FORMATS: { value: ImageFormat; label: string; ext: string; desc: string }[] = [
  { value: "image/jpeg", label: "JPEG", ext: ".jpg", desc: "通用格式，适合照片" },
  { value: "image/png", label: "PNG", ext: ".png", desc: "无损格式，支持透明" },
  { value: "image/webp", label: "WebP", ext: ".webp", desc: "现代格式，体积更小" },
  { value: "image/bmp", label: "BMP", ext: ".bmp", desc: "位图格式，无压缩" },
]

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("image/webp")
  const [processed, setProcessed] = useState<Blob | null>(null)
  const [converting, setConverting] = useState(false)

  const handleConvert = async () => {
    if (!file) return
    setConverting(true)
    try {
      const result = await convertImage(file, targetFormat)
      setProcessed(new Blob([result], { type: result.type }))
    } catch (e) {
      console.error("Conversion failed:", e)
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!processed || !file) return
    const url = URL.createObjectURL(processed)
    const a = document.createElement("a")
    const ext = getFormatExtension(targetFormat)
    a.href = url
    a.download = `${file.name.replace(/\.[^.]+$/, "")}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Format Convert"
      titleZh="格式转换"
      description="Convert images between PNG, JPEG, WebP, BMP formats"
      descriptionZh="在 PNG、JPEG、WebP、BMP 之间自由转换"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={setFile} />
              {file && (
                <p className="text-xs text-muted-foreground">
                  当前格式：{file.type} · {formatFileSize(file.size)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">🎯 目标格式</h3>
              <div className="space-y-2">
                {FORMATS.map((fmt) => (
                  <button
                    key={fmt.value}
                    onClick={() => setTargetFormat(fmt.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all text-sm ${
                      targetFormat === fmt.value
                        ? "bg-primary/10 border-2 border-primary text-primary font-medium"
                        : "border-2 border-transparent hover:bg-muted"
                    }`}
                  >
                    <span className="text-lg">{fmt.ext}</span>
                    <div>
                      <p className="font-medium">{fmt.label}</p>
                      <p className="text-xs text-muted-foreground">{fmt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleConvert}
                disabled={!file || converting}
                className="w-full rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {converting ? "转换中..." : "开始转换"}
              </button>
            </CardContent>
          </Card>
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
                  <p>上传图片并选择目标格式开始转换</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImagePreview
                    beforeFile={file}
                    afterBlob={processed}
                    beforeLabel={`原图 (${file.type.split("/")[1]?.toUpperCase()})`}
                    afterLabel={`转换后 (${getFormatExtension(targetFormat).toUpperCase()})`}
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
