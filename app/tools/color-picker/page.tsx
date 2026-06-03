"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { Card, CardContent } from "@/components/ui/card"
import { extractColors, formatFileSize } from "@/lib/image-utils"
import type { ColorInfo } from "@/lib/image-utils"
import { toast } from "sonner"

export default function ColorPickerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [colors, setColors] = useState<ColorInfo[]>([])
  const [extracting, setExtracting] = useState(false)

  const handleFile = async (f: File) => {
    setFile(f)
    setExtracting(true)
    try {
      const result = await extractColors(f, 8)
      setColors(result)
    } catch (e) {
      console.error("Color extraction failed:", e)
    } finally {
      setExtracting(false)
    }
  }

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex)
    toast.success(`已复制 ${hex}`)
  }

  return (
    <ToolLayout
      title="Color Picker"
      titleZh="图片取色器"
      description="Extract colors from images"
      descriptionZh="从图片中智能提取主要颜色，生成调色板"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={handleFile} />
            </CardContent>
          </Card>

          {extracting && (
            <Card>
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                🎨 正在提取颜色...
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Colors */}
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
                  <p>上传图片提取颜色</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-muted max-h-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Source"
                      className="w-full h-64 object-contain"
                    />
                  </div>

                  {/* Colors */}
                  {colors.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">提取的调色板</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {colors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => copyHex(color.hex)}
                            className="group relative rounded-xl overflow-hidden border border-border hover:scale-105 transition-transform"
                          >
                            <div
                              className="h-20 w-full"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="p-2 bg-card">
                              <p className="text-sm font-mono font-medium">{color.hex}</p>
                              <p className="text-xs text-muted-foreground">
                                RGB({color.rgb.join(", ")})
                              </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-medium">点击复制</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        点击色块可复制 HEX 颜色值
                      </p>
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
