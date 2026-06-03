import imageCompression from "browser-image-compression"

// ==================== Compression ====================

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  quality: number // 0-1
  useWebWorker?: boolean
}

export async function compressImage(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<File> {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    quality: 0.8,
    useWebWorker: true,
  }
  const merged = { ...defaultOptions, ...options }
  return imageCompression(file, { ...merged, useWebWorker: merged.useWebWorker ?? true })
}

export async function compressImages(
  files: File[],
  options: Partial<CompressionOptions> = {}
): Promise<File[]> {
  return Promise.all(files.map((f) => compressImage(f, options)))
}

// ==================== Format Conversion ====================

export type ImageFormat = "image/png" | "image/jpeg" | "image/webp" | "image/bmp"

export function getFormatExtension(format: ImageFormat): string {
  const map: Record<ImageFormat, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/bmp": "bmp",
  }
  return map[format]
}

export async function convertImage(file: File, format: ImageFormat, quality = 0.9): Promise<File> {
  const img = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  ctx.drawImage(img, 0, 0)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b)
        else reject(new Error("Conversion failed"))
      },
      format,
      quality
    )
  })

  const ext = getFormatExtension(format)
  return new File([blob], `${getBaseName(file.name)}.${ext}`, { type: format })
}

// ==================== Resize ====================

export interface ResizeOptions {
  width: number
  height: number
  maintainAspectRatio?: boolean
  quality?: number
}

export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<File> {
  const img = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  let { width, height } = options
  if (options.maintainAspectRatio !== false) {
    const ratio = img.naturalWidth / img.naturalHeight
    if (width && !height) height = Math.round(width / ratio)
    else if (height && !width) width = Math.round(height * ratio)
  }

  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await canvasToBlob(canvas, file.type, options.quality ?? 0.9)
  return new File([blob], file.name, { type: file.type })
}

// ==================== Crop ====================

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export async function cropImage(file: File, crop: CropArea): Promise<File> {
  const img = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  const blob = await canvasToBlob(canvas, file.type, 0.95)
  return new File([blob], `cropped_${file.name}`, { type: file.type })
}

// ==================== Watermark ====================

export interface WatermarkTextOptions {
  text: string
  fontSize?: number
  fontFamily?: string
  color?: string
  opacity?: number // 0-1
  position?: "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  offsetX?: number
  offsetY?: number
  rotation?: number // degrees
}

export interface WatermarkImageOptions {
  image: File
  scale?: number // relative to canvas size
  opacity?: number
  position?: "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  offsetX?: number
  offsetY?: number
}

export async function addTextWatermark(
  file: File,
  options: WatermarkTextOptions
): Promise<File> {
  const img = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  ctx.drawImage(img, 0, 0)

  const fontSize = options.fontSize ?? Math.max(canvas.width * 0.04, 24)
  ctx.font = `${fontSize}px ${options.fontFamily ?? "Arial, sans-serif"}`
  ctx.fillStyle = options.color ?? "#ffffff"
  ctx.globalAlpha = options.opacity ?? 0.5

  const metrics = ctx.measureText(options.text)
  const position = getWatermarkPosition(canvas, {
    width: metrics.width,
    height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent || fontSize,
  }, options)
  ctx.save()
  if (options.rotation) {
    ctx.translate(position.x, position.y)
    ctx.rotate((options.rotation * Math.PI) / 180)
    ctx.fillText(options.text, 0, 0)
  } else {
    ctx.fillText(options.text, position.x, position.y)
  }
  ctx.restore()

  const blob = await canvasToBlob(canvas, file.type, 0.95)
  return new File([blob], `watermarked_${file.name}`, { type: file.type })
}

export async function addImageWatermark(
  file: File,
  options: WatermarkImageOptions
): Promise<File> {
  const img = await loadImageFromFile(file)
  const wmImg = await loadImageFromFile(options.image)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  ctx.drawImage(img, 0, 0)

  const scale = options.scale ?? 0.15
  const wmWidth = canvas.width * scale
  const wmHeight = (wmImg.naturalHeight / wmImg.naturalWidth) * wmWidth

  ctx.globalAlpha = options.opacity ?? 0.5
  const pos = getWatermarkPosition(canvas, { width: wmWidth, height: wmHeight }, options)
  ctx.drawImage(wmImg, pos.x - wmWidth / 2, pos.y - wmHeight / 2, wmWidth, wmHeight)

  const blob = await canvasToBlob(canvas, file.type, 0.95)
  return new File([blob], `watermarked_${file.name}`, { type: file.type })
}

// ==================== Filters ====================

export interface FilterOptions {
  brightness?: number // default 100, range 0-200
  contrast?: number // default 100, range 0-200
  saturation?: number // default 100, range 0-200
  blur?: number // px, default 0
  sharpen?: number // 0-1
  grayscale?: number // 0-1
  sepia?: number // 0-1
  hueRotate?: number // degrees
  invert?: number // 0-1
}

export async function applyFilters(
  file: File,
  filterOptions: FilterOptions
): Promise<File> {
  const img = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  // Build CSS filter string
  const filters: string[] = []
  if (filterOptions.brightness !== undefined && filterOptions.brightness !== 100)
    filters.push(`brightness(${filterOptions.brightness}%)`)
  if (filterOptions.contrast !== undefined && filterOptions.contrast !== 100)
    filters.push(`contrast(${filterOptions.contrast}%)`)
  if (filterOptions.saturation !== undefined && filterOptions.saturation !== 100)
    filters.push(`saturate(${filterOptions.saturation}%)`)
  if (filterOptions.blur) filters.push(`blur(${filterOptions.blur}px)`)
  if (filterOptions.grayscale) filters.push(`grayscale(${filterOptions.grayscale})`)
  if (filterOptions.sepia) filters.push(`sepia(${filterOptions.sepia})`)
  if (filterOptions.hueRotate) filters.push(`hue-rotate(${filterOptions.hueRotate}deg)`)
  if (filterOptions.invert) filters.push(`invert(${filterOptions.invert})`)

  ctx.filter = filters.join(" ")
  ctx.drawImage(img, 0, 0)
  ctx.filter = "none"

  // Apply sharpen if needed
  if (filterOptions.sharpen && filterOptions.sharpen > 0) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const sharpened = sharpenImageData(imageData, filterOptions.sharpen)
    ctx.putImageData(sharpened, 0, 0)
  }

  const blob = await canvasToBlob(canvas, file.type, 0.95)
  return new File([blob], `filtered_${file.name}`, { type: file.type })
}

// ==================== Rotation ====================

export async function rotateImage(file: File, degrees: number): Promise<File> {
  const img = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  const rad = (degrees * Math.PI) / 180
  const absSin = Math.abs(Math.sin(rad))
  const absCos = Math.abs(Math.cos(rad))

  // Support both 90° and arbitrary angles
  if (degrees === 90 || degrees === 270) {
    canvas.width = img.naturalHeight
    canvas.height = img.naturalWidth
  } else if (degrees === 180) {
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
  } else {
    canvas.width = img.naturalWidth * absCos + img.naturalHeight * absSin
    canvas.height = img.naturalWidth * absSin + img.naturalHeight * absCos
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(rad)
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)

  const blob = await canvasToBlob(canvas, file.type, 0.95)
  return new File([blob], `rotated_${file.name}`, { type: file.type })
}

export async function flipImage(
  file: File,
  direction: "horizontal" | "vertical"
): Promise<File> {
  const img = await loadImageFromFile(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  if (direction === "horizontal") {
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
  } else {
    ctx.translate(0, canvas.height)
    ctx.scale(1, -1)
  }

  ctx.drawImage(img, 0, 0)
  const blob = await canvasToBlob(canvas, file.type, 0.95)
  return new File([blob], `flipped_${file.name}`, { type: file.type })
}

// ==================== Color Picker ====================

export interface ColorInfo {
  hex: string
  rgb: [number, number, number]
  frequency: number
}

export async function extractColors(
  file: File,
  count = 6
): Promise<ColorInfo[]> {
  const img = await loadImageFromFile(file)

  // Scale down for performance
  const maxDim = 100
  const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data

  // Color quantization using simple k-means
  const colorMap = new Map<string, number>()
  const step = 4 // Sample every 4th pixel
  for (let i = 0; i < pixels.length; i += step * 4) {
    // Quantize to reduce colors (16 levels per channel)
    const r = Math.round(pixels[i] / 16) * 16
    const g = Math.round(pixels[i + 1] / 16) * 16
    const b = Math.round(pixels[i + 2] / 16) * 16
    // Skip very dark and very light pixels
    if ((r + g + b) / 3 < 20 || (r + g + b) / 3 > 235) continue
    const key = `${r},${g},${b}`
    colorMap.set(key, (colorMap.get(key) ?? 0) + 1)
  }

  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key, freq]) => {
      const [r, g, b] = key.split(",").map(Number)
      return {
        hex: rgbToHex(r, g, b),
        rgb: [r, g, b] as [number, number, number],
        frequency: freq,
      }
    })
}

// ==================== Helpers ====================

export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024)
}

export function getFileSizeKB(file: File): number {
  return file.size / 1024
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getBaseName(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "")
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? ""
}

export function isValidImage(file: File): boolean {
  const validTypes = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif", "image/svg+xml", "image/avif"]
  return validTypes.includes(file.type)
}

export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/png"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new File([u8arr], filename, { type: mime })
}

// Internal helpers

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b)
        else reject(new Error("Canvas toBlob failed"))
      },
      type,
      quality
    )
  })
}

interface SizeLike {
  width: number
  height: number
}

function getWatermarkPosition(
  canvas: HTMLCanvasElement,
  size: SizeLike,
  options: { position?: string; offsetX?: number; offsetY?: number }
): { x: number; y: number } {
  const margin = 20
  const ox = options.offsetX ?? 0
  const oy = options.offsetY ?? 0

  switch (options.position ?? "center") {
    case "topLeft":
      return { x: margin + ox, y: size.height + margin + oy }
    case "topRight":
      return { x: canvas.width - size.width - margin + ox, y: size.height + margin + oy }
    case "bottomLeft":
      return { x: margin + ox, y: canvas.height - margin + oy }
    case "bottomRight":
      return { x: canvas.width - size.width - margin + ox, y: canvas.height - margin + oy }
    case "center":
    default:
      return { x: canvas.width / 2 + ox, y: canvas.height / 2 + oy }
  }
}

function sharpenImageData(
  imageData: ImageData,
  strength: number
): ImageData {
  const { data, width, height } = imageData
  const output = new Uint8ClampedArray(data)
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c
            val += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
          }
        }
        const idx = (y * width + x) * 4 + c
        output[idx] = Math.min(255, Math.max(0, data[idx] + (val - data[idx]) * strength))
      }
    }
  }

  return new ImageData(output, width, height)
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
