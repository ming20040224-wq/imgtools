"use client"

import { useState, useCallback, useRef } from "react"
import { ToolLayout, DownloadButton } from "@/components/ToolLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { downloadBlob } from "@/lib/image-utils"
import { jsPDF } from "jspdf"

// ==================== Image to PDF ====================

function ImageToPdfTab() {
  const [images, setImages] = useState<File[]>([])
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4")
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const addImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }, [])

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i))
  const moveUp = (i: number) => {
    if (i === 0) return
    setImages((prev) => {
      const arr = [...prev]
      ;[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
      return arr
    })
  }
  const moveDown = (i: number) => {
    if (i === images.length - 1) return
    setImages((prev) => {
      const arr = [...prev]
      ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
      return arr
    })
  }

  const convertToPdf = async () => {
    if (images.length === 0) return
    setProcessing(true)
    try {
      const sizes: Record<string, [number, number]> = { a4: [210, 297], letter: [216, 279] }
      const [pw, ph] = sizes[pageSize]
      const pdf = new jsPDF({ unit: "mm", format: pageSize })

      for (let i = 0; i < images.length; i++) {
        const img = await loadImage(images[i])
        const canvas = document.createElement("canvas")
        const maxW = pw - 10
        const maxH = ph - 10
        const scale = Math.min(maxW / (img.width / img.naturalWidth * 25.4 / img.width), maxH / (img.height / img.naturalHeight * 25.4 / img.height), 1)
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.getContext("2d")!.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92)

        const imgW = (img.naturalWidth * 25.4) / 96 * scale
        const imgH = (img.naturalHeight * 25.4) / 96 * scale
        const x = (pw - imgW) / 2
        const y = (ph - imgH) / 2

        if (i > 0) pdf.addPage()
        pdf.addImage(dataUrl, "JPEG", x, y, imgW, imgH)
      }

      pdf.save("images.pdf")
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">📤 上传图片</h3>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors"
            >
              <span className="text-2xl mb-2">🖼️</span>
              <p className="text-sm font-medium">点击选择图片</p>
              <p className="text-xs text-muted-foreground mt-1">支持 JPG / PNG / WebP，可多选</p>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
            </div>
          </CardContent>
        </Card>

        {images.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">📄 页面设置</h3>
                <span className="text-sm text-muted-foreground">{images.length} 张图片</span>
              </div>
              <div className="flex gap-2">
                {(["a4", "letter"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPageSize(s)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${pageSize === s ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                  >
                    {s === "a4" ? "A4" : "Letter"}
                  </button>
                ))}
              </div>
              <button
                onClick={convertToPdf}
                disabled={processing}
                className="w-full rounded-xl bg-gradient-brand text-white font-medium py-2.5 text-sm hover:shadow-lg transition-all disabled:opacity-50"
              >
                {processing ? "转换中..." : "转换为 PDF"}
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-4 sm:p-6">
            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <span className="text-4xl mb-4">📄</span>
                <p>上传图片后按顺序生成 PDF</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">拖拽排序尚未支持，请使用上下按钮调整顺序</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((f, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden bg-muted aspect-square group">
                      <img
                        src={URL.createObjectURL(f)}
                        alt={`Page ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-1.5 bg-black/60">
                        <span className="text-xs text-white font-medium">第 {i + 1} 页</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveUp(i)} disabled={i === 0} className="text-white/70 hover:text-white disabled:opacity-30 text-xs px-1">↑</button>
                          <button onClick={() => moveDown(i)} disabled={i === images.length - 1} className="text-white/70 hover:text-white disabled:opacity-30 text-xs px-1">↓</button>
                          <button onClick={() => removeImage(i)} className="text-red-400 hover:text-red-300 text-xs px-1">✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==================== PDF to Image ====================

function PdfToImageTab() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pages, setPages] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePdf = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfFile(file)
    setPages([])
    setProcessing(true)

    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist")
      GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.8.124/pdf.worker.min.mjs`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await getDocument({ data: arrayBuffer }).promise
      const pageUrls: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const scale = 2
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement("canvas")
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext("2d")!
        await page.render({ canvas, viewport }).promise
        pageUrls.push(canvas.toDataURL("image/jpeg", 0.92))
      }

      setPages(pageUrls)
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }, [])

  const downloadPage = (dataUrl: string, i: number) => {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `page_${i + 1}.jpg`
    document.body.appendChild(a)
    setTimeout(() => { a.click(); document.body.removeChild(a) }, 50)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">📤 上传 PDF</h3>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors"
            >
              <span className="text-2xl mb-2">📑</span>
              <p className="text-sm font-medium">点击选择 PDF 文件</p>
              <p className="text-xs text-muted-foreground mt-1">PDF 将在浏览器本地解析，不传输到服务器</p>
              <input ref={fileRef} type="file" accept=".pdf" onChange={handlePdf} className="hidden" />
            </div>
          </CardContent>
        </Card>

        {pdfFile && !processing && pages.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm">📋 页面列表</h3>
              <p className="text-xs text-muted-foreground">共 {pages.length} 页</p>
              <p className="text-xs text-muted-foreground">点击下方图片即可下载单页 JPG</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-4 sm:p-6">
            {!pdfFile ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <span className="text-4xl mb-4">📑</span>
                <p>上传 PDF 后每页将转换为图片</p>
              </div>
            ) : processing ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>解析中...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pages.map((dataUrl, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 cursor-pointer transition-colors" onClick={() => downloadPage(dataUrl, i)}>
                      <img src={dataUrl} alt={`Page ${i + 1}`} className="w-full" />
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                        第 {i + 1} 页 · 点击下载
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==================== Helpers ====================

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// ==================== Page ====================

export default function ImageToPdfPage() {
  return (
    <ToolLayout
      title="Image ↔ PDF"
      titleZh="图片转 PDF"
      description="Convert images to PDF and PDF to images"
      descriptionZh="图片转为 PDF 文件，或将 PDF 每一页转为图片"
    >
      <Tabs defaultValue="img2pdf" className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="img2pdf" className="flex-1 sm:flex-none">🖼️ → 📄 图片转 PDF</TabsTrigger>
          <TabsTrigger value="pdf2img" className="flex-1 sm:flex-none">📄 → 🖼️ PDF 转图片</TabsTrigger>
        </TabsList>
        <TabsContent value="img2pdf"><ImageToPdfTab /></TabsContent>
        <TabsContent value="pdf2img"><PdfToImageTab /></TabsContent>
      </Tabs>
    </ToolLayout>
  )
}
