import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-4">隐私政策</h1>
        <p className="text-lg text-muted-foreground">
          最后更新日期：2026 年 6 月 3 日
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">1. 图片隐私</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                <strong>你的图片不会上传到任何服务器。</strong> Pixelab 的所有
                图片处理功能都在你的浏览器本地完成，使用 HTML5 Canvas API 和 WebAssembly
                技术。
              </p>
              <p>
                这意味着：我们无法看到、访问、存储或以任何方式处理你的图片。
                你的图片数据始终在你的设备上，从未离开。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">2. 数据收集</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>我们使用以下服务来了解网站使用情况：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Google Analytics</strong> — 收集匿名的页面浏览数据（如
                  访问量、页面停留时间、使用的工具类型等）。不包含任何个人信息或图片内容。
                </li>
                <li>
                  <strong>Google AdSense</strong> — 展示个性化广告。Google 可能
                  使用 Cookie 来提供更相关的广告。
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">3. Cookie</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>我们使用以下类型的 Cookie：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>必要的 Cookie</strong> — 用于基本的网站功能（如主题偏好）</li>
                <li><strong>分析 Cookie</strong> — 用于了解网站使用情况</li>
                <li><strong>广告 Cookie</strong> — 用于提供个性化广告</li>
              </ul>
              <p>你可以在浏览器设置中管理或禁用 Cookie。</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">4. 第三方服务</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>我们的网站可能包含指向第三方网站的链接。我们对这些网站的隐私做法
                不负责任，建议你查看它们的隐私政策。</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">5. 儿童隐私</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>我们的服务不针对 13 岁以下的儿童。我们不会故意收集儿童的个人信息。</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">6. 政策更新</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>我们可能会不时更新本隐私政策。更新后的政策将在此页面发布，
                重大变更会通过网站公告通知。</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">7. 联系我们</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>如果你对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
              <p>
                📮 在{" "}
                <a href="https://github.com" className="text-primary hover:underline">
                  GitHub
                </a>{" "}
                提交 Issue
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
