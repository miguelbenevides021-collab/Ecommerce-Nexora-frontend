import { useEffect } from "react"
import { Check, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"

export function CartToast() {
  const { lastAdded, clearLastAdded } = useCart()

  useEffect(() => {
    if (!lastAdded) return
    const timer = window.setTimeout(clearLastAdded, 2800)
    return () => window.clearTimeout(timer)
  }, [lastAdded, clearLastAdded])

  if (!lastAdded) return null

  return (
    <div
      role="status"
      className="cart-toast fixed bottom-4 left-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-nexora/30 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md md:bottom-6 md:left-6"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-nexora/15 text-nexora">
        <Check className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">Adicionado ao carrinho</p>
        <p className="truncate text-xs text-muted-foreground">{lastAdded.name}</p>
      </div>
      <ShoppingCart className="ml-2 size-4 shrink-0 text-nexora" />
    </div>
  )
}
