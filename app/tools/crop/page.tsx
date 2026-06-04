"use client"

import { useState, useCallback } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cropImage, formatFileSize, downloadBlob } from "@/lib/image-utils"
import Cropper, { type Area } from "react-easy-crop"

const PRESETS = [
  { label: "自由", w: 0, h: 0 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "16:9", w: 16, h: 9 },
  { label: "3:2", w: 3, h: 2 },
  { label: "2:3", w: 2, h: 3 },
  { label: "9:16", w: 9, h: 16 },
]

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState<number | undefined>(undefined)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processed, setProcessed] = useState<Blob | null>(null)

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setProcessed(null)
    const url = URL.createObjectURL(f)
    setImageUrl(url)
  }, [])

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCrop = async () => {
    if (!file || !croppedAreaPixels) return
    try {
      const result = await cropImage(file, {
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
        width: croppedAreaPixels.width,
        height: croppedAreaPixels.height,
      })
      const blob = new Blob([result], { type: result.type })
      setProcessed(blob)
    } catch (e) {
      console.error("Crop failed:", e)
    }
  }

  const handleDownload = () => {
    if (!processed) return
    downloadBlob(processed, `cropped_${file?.name ?? "image.jpg"}`)
  }

  return (
    <ToolLayout
      title="Image Crop"
      titleZh="图片裁剪"
      description="Crop images with preset ratios or freeform"
      descriptionZh="使用预设比例或自由裁剪图片"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={handleFile} />
            </CardContent>
          </Card>

          {imageUrl && (
            <>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold">📐 裁剪比例</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setAspect(preset.w && preset.h ? preset.w / preset.h : undefined)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          (preset.w === 0 && aspect === undefined) ||
                          (preset.w !== 0 && aspect === preset.w / preset.h)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold">🔍 缩放</h3>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCrop}
                      disabled={!croppedAreaPixels}
                      className="flex-1 rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      裁剪
                    </button>
                    {processed && (
                      <DownloadButton
                        onClick={handleDownload}
                        label="下载"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right: Cropper */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 sm:p-6">
              {!imageUrl ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-40">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p>上传图片开始裁剪</p>
                </div>
              ) : processed ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(processed)}
                    alt="Cropped result"
                    className="max-h-[500px] rounded-xl object-contain mx-auto"
                  />
                  <p className="text-center text-sm text-muted-foreground">
                    裁剪完成 · {formatFileSize(processed.size)}
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setProcessed(null)}>
                      重新裁剪
                    </Button>
                    <DownloadButton onClick={handleDownload} />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-muted">
                  <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}
