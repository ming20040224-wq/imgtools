export interface Tool {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  icon: string
  href: string
  category: "image" | "advanced"
  categoryZh: string
  badge?: string
  badgeZh?: string
}

export const tools: Tool[] = [
  {
    id: "compress",
    name: "Image Compress",
    nameZh: "图片压缩",
    description: "Reduce image file size while maintaining quality. Support batch processing.",
    descriptionZh: "减小图片文件大小同时保持画质，支持批量处理",
    icon: "🗜️",
    href: "/tools/compress",
    category: "image",
    categoryZh: "基础工具",
    badge: "Popular",
    badgeZh: "热门",
  },
  {
    id: "convert",
    name: "Format Convert",
    nameZh: "格式转换",
    description: "Convert between PNG, JPEG, WebP, BMP and more formats.",
    descriptionZh: "在 PNG、JPEG、WebP、BMP 等格式之间自由转换",
    icon: "🔄",
    href: "/tools/convert",
    category: "image",
    categoryZh: "基础工具",
  },
  {
    id: "crop",
    name: "Image Crop",
    nameZh: "图片裁剪",
    description: "Crop images with preset ratios (1:1, 16:9, 4:3) or freeform.",
    descriptionZh: "自由裁剪或使用预设比例（1:1、16:9、4:3）",
    icon: "✂️",
    href: "/tools/crop",
    category: "image",
    categoryZh: "基础工具",
  },
  {
    id: "resize",
    name: "Image Resize",
    nameZh: "调整大小",
    description: "Resize images by pixels or percentage, with aspect ratio lock.",
    descriptionZh: "按像素或百分比调整图片尺寸，支持锁定宽高比",
    icon: "📐",
    href: "/tools/resize",
    category: "image",
    categoryZh: "基础工具",
  },
  {
    id: "watermark",
    name: "Watermark",
    nameZh: "图片加水印",
    description: "Add text or image watermarks with customizable opacity and position.",
    descriptionZh: "添加文字或图片水印，可自定义透明度和位置",
    icon: "💧",
    href: "/tools/watermark",
    category: "image",
    categoryZh: "基础工具",
  },
  {
    id: "remove-bg",
    name: "Remove Background",
    nameZh: "AI 去背景",
    description: "Automatically remove image background with AI, no upload needed.",
    descriptionZh: "AI 智能去除图片背景，无需上传服务器",
    icon: "🎭",
    href: "/tools/remove-bg",
    category: "advanced",
    categoryZh: "高级工具",
    badge: "AI",
    badgeZh: "AI",
  },
  {
    id: "filter",
    name: "Filters",
    nameZh: "图片滤镜",
    description: "Apply brightness, contrast, saturation, blur and more filters.",
    descriptionZh: "调整亮度、对比度、饱和度，添加模糊等滤镜效果",
    icon: "🎨",
    href: "/tools/filter",
    category: "advanced",
    categoryZh: "高级工具",
  },
  {
    id: "rotate",
    name: "Rotate & Flip",
    nameZh: "旋转翻转",
    description: "Rotate 90° / 180° / 270° or flip horizontally / vertically.",
    descriptionZh: "90°旋转、180°旋转、水平翻转、垂直翻转",
    icon: "↔️",
    href: "/tools/rotate",
    category: "image",
    categoryZh: "基础工具",
  },
  {
    id: "color-picker",
    name: "Color Picker",
    nameZh: "图片取色器",
    description: "Extract colors from any image and generate a color palette.",
    descriptionZh: "从图片中提取颜色，生成调色板",
    icon: "🌈",
    href: "/tools/color-picker",
    category: "advanced",
    categoryZh: "高级工具",
  },
  {
    id: "image-to-pdf",
    name: "Image ↔ PDF",
    nameZh: "图片转 PDF",
    description: "Convert images to PDF and extract pages from PDF to images.",
    descriptionZh: "图片合成为 PDF 文件，或将 PDF 每一页转成图片",
    icon: "📄",
    href: "/tools/image-to-pdf",
    category: "image",
    categoryZh: "基础工具",
    badge: "New",
    badgeZh: "新",
  },
]

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id)
}

export function getToolsByCategory(category: Tool["category"]): Tool[] {
  return tools.filter((t) => t.category === category)
}
