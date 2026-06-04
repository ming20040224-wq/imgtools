import Link from "next/link"
import Logo from "@/components/Logo"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-lg">Pixelab</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              免费在线图片处理工具箱。所有处理都在你的浏览器中完成，不上传服务器，保护你的隐私。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tools/compress" className="hover:text-primary transition-colors">
                  图片压缩
                </Link>
              </li>
              <li>
                <Link href="/tools/convert" className="hover:text-primary transition-colors">
                  格式转换
                </Link>
              </li>
              <li>
                <Link href="/tools/crop" className="hover:text-primary transition-colors">
                  图片裁剪
                </Link>
              </li>
              <li>
                <Link href="/tools/remove-bg" className="hover:text-primary transition-colors">
                  AI 去背景
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3">关于</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pixelab. All rights reserved. 图片处理在浏览器本地完成，保护你的隐私。</p>
        </div>
      </div>
    </footer>
  )
}
