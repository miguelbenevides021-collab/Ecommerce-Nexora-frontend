import { ArrowUp } from "lucide-react"
import { useScrolled } from "@/hooks/useScrolled"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BackToTop() {
  const visible = useScrolled(480)

  return (
    <Button
      size="icon-lg"
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed right-4 bottom-4 z-40 bg-nexora text-primary-foreground shadow-lg nexora-glow transition-all duration-300 md:right-6 md:bottom-6",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="size-5" />
    </Button>
  )
}
