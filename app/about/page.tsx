import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-4">关于 ImgTools</h1>
        <p className="text-lg text-muted-foreground">
          ImgTools 是一个免费的在线图片处理工具箱，致力于让图片处理变得简单、快速、安全。
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">🎯 我们的理念</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                在当今数字时代，图片处理是每个人都会遇到的需求。但传统的图片处理
                软件要么体积庞大、操作复杂，要么需要付费订阅。
              </p>
              <p>
                ImgTools 的诞生就是为了解决这个问题——我们提供一套简洁、高效的
                在线图片处理工具，无需下载安装，无需注册登录，打开浏览器就能用。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">🔒 隐私优先</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                我们非常重视你的隐私。所有图片处理都在你的浏览器本地完成——
                图片不会上传到任何服务器。这意味着：
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>你的图片永远不会离开你的设备</li>
                <li>没有任何人能访问你的图片</li>
                <li>不需要担心数据泄露</li>
                <li>即使断网也能正常使用（首次加载后）</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">🛠️ 功能介绍</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>目前 ImgTools 提供以下功能：</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>图片压缩</strong> — 减小文件大小，支持批量处理</li>
                <li><strong>格式转换</strong> — PNG、JPEG、WebP、BMP 互相转换</li>
                <li><strong>图片裁剪</strong> — 自由裁剪或预设比例</li>
                <li><strong>调整大小</strong> — 按像素或百分比缩放</li>
                <li><strong>图片加水印</strong> — 文字水印和图片水印</li>
                <li><strong>AI 去背景</strong> — 智能移除图片背景</li>
                <li><strong>图片滤镜</strong> — 亮度、对比度、饱和度等调整</li>
                <li><strong>旋转翻转</strong> — 90°旋转和水平/垂直翻转</li>
                <li><strong>取色器</strong> — 提取图片颜色生成调色板</li>
              </ul>
              <p>我们还在持续添加更多功能，敬请期待！</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">💰 完全免费</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                ImgTools 的所有工具完全免费使用，无隐藏收费，无使用次数限制。
              </p>
              <p>
                我们通过网站广告维持运营，未来可能会推出高级功能订阅，但核心功能将永久免费。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">📧 联系我们</h2>
            <div className="text-muted-foreground leading-relaxed">
              <p>
                如果你有任何建议、反馈或合作意向，欢迎通过以下方式联系我们：
              </p>
              <p className="mt-2">
                📮 GitHub Issues:{" "}
                <a
                  href="https://github.com"
                  className="text-primary hover:underline"
                >
                  提交反馈
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
