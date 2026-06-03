"use client"

import { useState } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { ImagePreview } from "@/components/ImagePreview"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addTextWatermark, addImageWatermark, formatFileSize } from "@/lib/image-utils"

type Position = "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

const POSITIONS: { value: Position; label: string }[] = [
  { value: "center", label: "居中" },
  { value: "topLeft", label: "左上" },
  { value: "topRight", label: "右上" },
  { value: "bottomLeft", label: "左下" },
  { value: "bottomRight", label: "右下" },
]

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null)
  const [processed, setProcessed] = useState<Blob | null>(null)
  const [processing, setProcessing] = useState(false)

  // Text watermark
  const [text, setText] = useState("")
  const [fontSize, setFontSize] = useState(36)
  const [textColor, setTextColor] = useState("#ffffff")
  const [textOpacity, setTextOpacity] = useState(50)
  const [textPosition, setTextPosition] = useState<Position>("bottomRight")
  const [rotation, setRotation] = useState(0)

  // Image watermark
  const [wmFile, setWmFile] = useState<File | null>(null)
  const [wmScale, setWmScale] = useState(15)
  const [wmOpacity, setWmOpacity] = useState(70)
  const [wmPosition, setWmPosition] = useState<Position>("bottomRight")

  const [mode, setMode] = useState<"text" | "image">("text")

  const handleAddWatermark = async () => {
    if (!file) return
    setProcessing(true)
    try {
      let result: File
      if (mode === "text" && text) {
        result = await addTextWatermark(file, {
          text,
          fontSize,
          color: textColor,
          opacity: textOpacity / 100,
          position: textPosition,
          rotation,
        })
      } else if (mode === "image" && wmFile) {
        result = await addImageWatermark(file, {
          image: wmFile,
          scale: wmScale / 100,
          opacity: wmOpacity / 100,
          position: wmPosition,
        })
      } else {
        return
      }
      setProcessed(new Blob([result], { type: result.type }))
    } catch (e) {
      console.error("Watermark failed:", e)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processed) return
    const url = URL.createObjectURL(processed)
    const a = document.createElement("a")
    a.href = url
    a.download = `watermarked_${file?.name ?? "image.jpg"}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Watermark"
      titleZh="图片加水印"
      description="Add text or image watermarks"
      descriptionZh="添加文字或图片水印，保护你的图片版权"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={setFile} />
            </CardContent>
          </Card>

          {file && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">💧 水印设置</h3>
                <Tabs value={mode} onValueChange={(v) => setMode(v as "text" | "image")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="text" className="flex-1">文字水印</TabsTrigger>
                    <TabsTrigger value="image" className="flex-1">图片水印</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4 mt-4">
                    <Input
                      placeholder="输入水印文字..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <div className="space-y-2">
                      <label className="text-sm">字号 ({fontSize}px)</label>
                      <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={12} max={120} />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm">颜色</label>
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">透明度 ({textOpacity}%)</label>
                      <Slider value={[textOpacity]} onValueChange={([v]) => setTextOpacity(v)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">旋转 ({rotation}°)</label>
                      <Slider value={[rotation]} onValueChange={([v]) => setRotation(v)} min={-90} max={90} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">位置</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {POSITIONS.map((pos) => (
                          <button
                            key={pos.value}
                            onClick={() => setTextPosition(pos.value)}
                            className={`text-xs py-1.5 rounded-lg transition-colors ${
                              textPosition === pos.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium">水印图片</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && setWmFile(e.target.files[0])}
                        className="mt-2 text-sm"
                      />
                      {wmFile && (
                        <p className="text-xs text-muted-foreground mt-1">{wmFile.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">大小 ({wmScale}%)</label>
                      <Slider value={[wmScale]} onValueChange={([v]) => setWmScale(v)} min={5} max={50} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">透明度 ({wmOpacity}%)</label>
                      <Slider value={[wmOpacity]} onValueChange={([v]) => setWmOpacity(v)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">位置</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {POSITIONS.map((pos) => (
                          <button
                            key={pos.value}
                            onClick={() => setWmPosition(pos.value)}
                            className={`text-xs py-1.5 rounded-lg transition-colors ${
                              wmPosition === pos.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <button
                  onClick={handleAddWatermark}
                  disabled={processing || (mode === "text" && !text) || (mode === "image" && !wmFile)}
                  className="w-full rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {processing ? "处理中..." : "添加水印"}
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
                  <p>上传图片开始添加水印</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImagePreview
                    beforeFile={file}
                    afterBlob={processed}
                    beforeLabel="原图"
                    afterLabel="加水印后"
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
