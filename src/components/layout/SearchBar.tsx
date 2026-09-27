import { type FormEvent, useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string
  placeholder?: string
  compact?: boolean
}

export function SearchBar({
  className,
  placeholder = "Buscar produtos, marcas ou categorias...",
  compact = false,
}: SearchBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") ?? "")

  useEffect(() => {
    setValue(searchParams.get("q") ?? "")
  }, [searchParams])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = value.trim()
    const next = new URLSearchParams(
      location.pathname.startsWith("/produtos") ? searchParams : undefined
    )

    if (query) {
      next.set("q", query)
    } else {
      next.delete("q")
    }

    const search = next.toString()
    const productsPath = location.pathname.startsWith("/produtos/")
      ? location.pathname
      : "/produtos"
    navigate(search ? `${productsPath}?${search}` : productsPath)
  }

  return (
    <form className={cn("relative w-full", className)} onSubmit={handleSubmit}>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground",
          compact ? "size-4" : "size-4.5"
        )}
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar produtos"
        className={cn(
          "border-border/60 bg-secondary/50 pl-10 transition-all",
          "hover:border-nexora/30 hover:bg-secondary/80",
          "focus-visible:border-nexora/50 focus-visible:bg-secondary/80 focus-visible:ring-nexora/20",
          compact ? "h-9 text-sm" : "h-10 md:h-11"
        )}
      />
    </form>
  )
}
