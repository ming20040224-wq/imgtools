import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tool } from "@/lib/tools-data"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.href} className="group block">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1 border-border/50 hover:border-primary/30">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            {/* Icon */}
            <div className="flex items-center justify-between">
              <span className="text-3xl">{tool.icon}</span>
              {tool.badge && (
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
                >
                  {tool.badge}
                </Badge>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                {tool.nameZh}
              </h3>
              <p className="text-xs text-muted-foreground">{tool.name}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {tool.descriptionZh}
            </p>

            {/* Arrow on hover */}
            <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              开始使用
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
