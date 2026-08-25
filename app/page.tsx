import Link from "next/link"
import { tools } from "@/lib/tools-data"
import { ToolCard } from "@/components/ToolCard"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ======= Hero Section ======= */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-white to-white dark:from-purple-950/20 dark:via-background dark:to-background" />

        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-fuchsia-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-12 sm:pt-28 sm:pb-16 text-center">
          <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20 rounded-full"
            >
              完全免费 · 无需注册 · 本地处理
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              一站式
              <span className="text-gradient"> 在线图片处理 </span>
              工具箱
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              所有处理都在你的浏览器中完成，图片不上传服务器。
              专注六项高频功能：压缩、格式转换、裁剪、调整尺寸、水印和 AI 去背景。
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/tools/compress"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl text-base font-medium px-8 h-12 bg-gradient-brand text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5"
              >
                开始使用
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="#basic-tools"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl text-base font-medium px-8 h-12 border border-input bg-background hover:bg-muted transition-colors"
              >
                浏览全部工具
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                全部免费使用
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                数据不上传
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                批量处理
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= Basic Tools Section ======= */}
      <section id="basic-tools" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium text-primary">核心工具</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">从上传到下载，专注完成图片处理</h2>
            <p className="mt-3 text-muted-foreground">每个工具都尽量只解决一个问题，减少选择成本，也让处理过程更轻快。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">简单且可控</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">三步完成，无需把图片交给别人</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">选择工具、上传图片、下载结果。除首次使用 AI 去背景需下载模型外，图片处理都在当前设备的浏览器中完成。</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-3">
              {[['01', '选择工具', '从最常见的处理需求开始。'], ['02', '上传图片', '支持拖拽、点击上传与批量处理。'], ['03', '下载结果', '确认效果后立即保存到设备。']].map(([number, title, desc]) => (
                <li key={number} className="rounded-2xl border border-border/70 bg-background p-5">
                  <span className="text-sm font-semibold text-primary">{number}</span>
                  <h3 className="mt-6 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ======= Features Section ======= */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              为什么选择 Pixelab？
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "隐私安全",
                desc: "所有处理在浏览器本地完成，图片不会上传到任何服务器",
              },
              {
                title: "极速处理",
                desc: "利用 Web Worker 多线程处理，大文件也能快速完成",
              },
              {
                title: "简洁美观",
                desc: "精心设计的界面，无需学习即可上手使用",
              },
              {
                title: "全平台适配",
                desc: "支持桌面端和移动端，随时随地处理图片",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA Section ======= */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            准备好了吗？
          </h2>
          <p className="text-muted-foreground mb-8">
            拖拽一张图片开始处理，无需注册，完全免费
          </p>
          <Link
            href="/tools/compress"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl text-base font-medium px-10 h-12 bg-gradient-brand text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            免费开始使用 →
          </Link>
        </div>
      </section>
    </div>
  )
}
