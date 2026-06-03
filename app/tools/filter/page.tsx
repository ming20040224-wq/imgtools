"use client"

import { useState } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { ImagePreview } from "@/components/ImagePreview"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { applyFilters, formatFileSize } from "@/lib/image-utils"
import type { FilterOptions } from "@/lib/image-utils"

const DEFAULT_FILTERS: Required<Omit<FilterOptions, "sharpen">> & { sharpen: number } = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sharpen: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
}

export default function FilterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [processed, setProcessed] = useState<Blob | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleApply = async () => {
    if (!file) return
    setProcessing(true)
    try {
      const result = await applyFilters(file, filters)
      setProcessed(new Blob([result], { type: result.type }))
    } catch (e) {
      console.error("Filter failed:", e)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processed) return
    const url = URL.createObjectURL(processed)
    const a = document.createElement("a")
    a.href = url
    a.download = `filtered_${file?.name ?? "image.jpg"}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => setFilters(DEFAULT_FILTERS)

  return (
    <ToolLayout
      title="Filters"
      titleZh="图片滤镜"
      description="Adjust brightness, contrast, saturation and more"
      descriptionZh="调整亮度、对比度、饱和度等滤镜效果"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={setFile} />
            </CardContent>
          </Card>

          {file && (
            <Card>
              <CardContent className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">🎚️ 调整</h3>
                  <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
                    重置
                  </Button>
                </div>

                <FilterSlider label="亮度" value={filters.brightness!} onChange={(v) => setFilters({...filters, brightness: v})} min={0} max={200} reset={100} unit="%" />
                <FilterSlider label="对比度" value={filters.contrast!} onChange={(v) => setFilters({...filters, contrast: v})} min={0} max={200} reset={100} unit="%" />
                <FilterSlider label="饱和度" value={filters.saturation!} onChange={(v) => setFilters({...filters, saturation: v})} min={0} max={200} reset={100} unit="%" />
                <FilterSlider label="模糊" value={filters.blur!} onChange={(v) => setFilters({...filters, blur: v})} min={0} max={20} reset={0} unit="px" />
                <FilterSlider label="锐化" value={filters.sharpen!} onChange={(v) => setFilters({...filters, sharpen: v})} min={0} max={100} reset={0} unit="%" />
                <FilterSlider label="灰度" value={filters.grayscale!} onChange={(v) => setFilters({...filters, grayscale: v / 100})} min={0} max={100} reset={0} unit="%" />
                <FilterSlider label="复古" value={filters.sepia! * 100} onChange={(v) => setFilters({...filters, sepia: v / 100})} min={0} max={100} reset={0} unit="%" />
                <FilterSlider label="色相旋转" value={filters.hueRotate!} onChange={(v) => setFilters({...filters, hueRotate: v})} min={0} max={360} reset={0} unit="°" />
                <FilterSlider label="反色" value={filters.invert! * 100} onChange={(v) => setFilters({...filters, invert: v / 100})} min={0} max={100} reset={0} unit="%" />

                <button
                  onClick={handleApply}
                  disabled={processing}
                  className="w-full rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {processing ? "处理中..." : "应用滤镜"}
                </button>
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
                  <p>上传图片开始调整</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImagePreview
                    beforeFile={file}
                    afterBlob={processed}
                    beforeLabel="原图"
                    afterLabel="滤镜后"
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

function FilterSlider({
  label,
  value,
  onChange,
  min,
  max,
  reset: resetVal,
  unit,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  reset: number
  unit: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {value}{unit}
        </span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={1} />
    </div>
  )
}
