"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { ImageUploaderWithPreview } from "@/components/ImageUploader"
import { ImagePreview } from "@/components/ImagePreview"
import { Card, CardContent } from "@/components/ui/card"
import { formatFileSize, downloadBlob } from "@/lib/image-utils"

// Dynamic import to avoid SSR issues with WASM
const RemoveBgTool = dynamic(() => import("./RemoveBgTool"), { ssr: false })

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null)
  const [processed, setProcessed] = useState<Blob | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState("")

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setProcessed(null)
  }, [])

  const handleRemoveBg = async () => {
    if (!file) return
    setProcessing(true)
    setProgress("正在加载 AI 模型...")
    try {
      const { removeBackground } = await import("@imgly/background-removal")
      setProgress("正在处理图片...")
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          setProgress(`处理中... ${Math.round((current / total) * 100)}%`)
        },
      })
      setProcessed(blob)
      setProgress("")
    } catch (e) {
      console.error("Background removal failed:", e)
      setProgress("处理失败，请重试")
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processed || !file) return
    downloadBlob(processed, `${file.name.replace(/\.[^.]+$/, "")}_nobg.png`)
  }

  return (
    <ToolLayout
      title="Remove Background"
      titleZh="AI 去背景"
      description="Automatically remove image background with AI"
      descriptionZh="使用 AI 智能识别并移除图片背景，处理在浏览器本地完成"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">📤 上传图片</h3>
              <ImageUploaderWithPreview onFile={handleFile} />
              {file && (
                <p className="text-xs text-muted-foreground">
                  文件大小：{formatFileSize(file.size)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">🤖 AI 设置</h3>
              <p className="text-sm text-muted-foreground">
                首次使用需要下载 AI 模型（约 40MB），之后可以离线使用。
                所有处理在你的浏览器中完成，图片不会上传。
              </p>
              <button
                onClick={handleRemoveBg}
                disabled={!file || processing}
                className="w-full rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "处理中..." : "🚀 开始去背景"}
              </button>
              {progress && (
                <p className="text-sm text-center text-muted-foreground">{progress}</p>
              )}
            </CardContent>
          </Card>
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
                  <p>上传图片开始去背景</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImagePreview
                    beforeFile={file}
                    afterBlob={processed}
                    beforeLabel="原图"
                    afterLabel="去背景后"
                  />
                  {processed && (
                    <div className="flex justify-center">
                      <DownloadButton onClick={handleDownload} label="下载 PNG（透明背景）" />
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
