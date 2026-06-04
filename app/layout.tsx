import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Analytics } from "@/components/Analytics"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Pixelab - 免费在线图片处理工具箱",
    template: "%s | Pixelab",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  description:
    "免费的在线图片处理工具箱，支持图片压缩、格式转换、裁剪、调整大小、加水印、AI去背景等。无需上传服务器，保护隐私安全。",
  keywords: [
    "图片处理",
    "在线工具",
    "图片压缩",
    "格式转换",
    "AI去背景",
    "加水印",
    "免费",
    "image tools",
    "compress",
    "convert",
  ],
  authors: [{ name: "Pixelab" }],
  creator: "Pixelab",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://z24.homes",
    siteName: "Pixelab",
    title: "Pixelab - 免费在线图片处理工具箱",
    description: "免费在线图片处理，无需上传服务器，保护你的隐私。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixelab - 免费在线图片处理工具箱",
    description: "免费在线图片处理，无需上传服务器，保护你的隐私。",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="baidu-site-verification" content="codeva-dKOLsMQnUl" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Analytics />
        <ThemeProvider>
          <TooltipProvider delay={300}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
