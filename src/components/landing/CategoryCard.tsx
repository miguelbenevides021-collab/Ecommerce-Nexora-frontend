import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import type { Category } from "@/types"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon

  return (
    <Link
      to={category.href}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border/60 bg-card/50 p-5 transition-all duration-300",
        "hover:border-nexora/40 hover:bg-card hover:shadow-[0_0_30px_var(--nexora-glow)]"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-lg border border-border/60 bg-secondary/50 transition-colors group-hover:border-nexora/30 group-hover:bg-nexora/10">
          <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-nexora" />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-nexora group-hover:opacity-100" />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{category.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  )
}
