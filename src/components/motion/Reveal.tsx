import type { CSSProperties, ReactNode } from "react"
import { useInView } from "@/hooks/useInView"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()

  return (
    <div
      ref={ref}
      className={cn(
        !reduced && "reveal",
        (inView || reduced) && "reveal-visible",
        className
      )}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
