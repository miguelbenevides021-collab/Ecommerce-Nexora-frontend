import type { NavLink } from "@/types"

export const navLinks: NavLink[] = [
  { label: "Ofertas", href: "/produtos?ofertas=1", highlight: true },
  { label: "Produtos", href: "/produtos" },
  { label: "Hardware", href: "/produtos?categoria=Placas de vídeo" },
  { label: "Periféricos", href: "/produtos?categoria=Periféricos" },
  { label: "Monitores", href: "/produtos?categoria=Monitores" },
]
