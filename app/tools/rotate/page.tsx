"use client"

import { useState } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { ImagePreview } from "@/components/ImagePreview"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { rotateImage, flipImage, formatFileSize } from "@/lib/image-utils"

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null)
  const [processed, setProcessed] = useState<Blob | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleRotate = async (degrees: number) => {
    if (!file) return
    setProcessing(true)
    try {
      const result = await rotateImage(file, degrees)
      setProcessed(new Blob([result], { type: result.type }))
      setFile(result) // Update file for subsequent operations
    } catch (e) {
      console.error("Rotate failed:", e)
    } finally {
      setProcessing(false)
    }
  }

  const handleFlip = async (direction: "horizontal" | "vertical") => {
    if (!file) return
    setProcessing(true)
    try {
      const result = await flipImage(file, direction)
      setProcessed(new Blob([result], { type: result.type }))
      setFile(result)
    } catch (e) {
      console.error("Flip failed:", e)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processed) return
    const url = URL.createObjectURL(processed)
    const a = document.createElement("a")
    a.href = url
    a.download = `rotated_${file?.name ?? "image.jpg"}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Rotate & Flip"
      titleZh="旋转翻转"
      description="Rotate and flip images"
      descriptionZh="旋转和翻转图片，支持 90° 旋转和水平/垂直翻转"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={(f) => { setFile(f); setProcessed(null) }} />
            </CardContent>
          </Card>

          {file && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">↔️ 操作</h3>

                {/* Rotate */}
                <div>
                  <p className="text-sm font-medium mb-2">旋转</p>
                  <div className="flex gap-2">
                    {[
                      { deg: -90, icon: "↺", label: "左转 90°" },
                      { deg: 90, icon: "↻", label: "右转 90°" },
                      { deg: 180, icon: "🔄", label: "180°" },
                    ].map((item) => (
                      <button
                        key={item.deg}
                        onClick={() => handleRotate(item.deg)}
                        disabled={processing}
                        className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm disabled:opacity-50"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flip */}
                <div>
                  <p className="text-sm font-medium mb-2">翻转</p>
                  <div className="flex gap-2">
                    {[
                      { dir: "horizontal" as const, icon: "↔️", label: "水平翻转" },
                      { dir: "vertical" as const, icon: "↕️", label: "垂直翻转" },
                    ].map((item) => (
                      <button
                        key={item.dir}
                        onClick={() => handleFlip(item.dir)}
                        disabled={processing}
                        className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm disabled:opacity-50"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (file) {
                      setFile(file)
                      setProcessed(null)
                    }
                  }}
                  className="w-full text-xs"
                >
                  重置
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right */}
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
                  <p>上传图片开始操作</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImagePreview
                    beforeFile={file}
                    afterBlob={processed}
                    beforeLabel="操作前"
                    afterLabel="操作后"
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
