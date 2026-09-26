import { Link } from "react-router-dom"
import { Globe, Share2, Users, Video, Zap } from "lucide-react"
import { footerLinks, paymentMethods } from "@/data/site"
import { cn } from "@/lib/utils"

const socialLinks = [
  { icon: Share2, label: "Instagram", href: "#" },
  { icon: Globe, label: "Twitter", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
  { icon: Users, label: "LinkedIn", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="section-container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg border border-nexora/30 bg-nexora/10">
                <Zap className="size-4 text-nexora" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold tracking-[0.2em]">NEXORA</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sua loja de tecnologia de confiança. Hardware premium, entrega
              rápida e suporte especializado para quem exige o melhor.
            </p>

            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-nexora/40 hover:bg-nexora/10 hover:text-nexora"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-nexora"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-nexora"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-10 border-t border-border/40 pt-8">
          <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Formas de pagamento
          </p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className={cn(
                  "rounded-md border border-border/60 bg-secondary/30 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                )}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col gap-2 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} NEXORA Tecnologia Ltda. Todos os
            direitos reservados.
          </p>
          <p>CNPJ 00.000.000/0001-00 · São Paulo, SP</p>
        </div>
      </div>
    </footer>
  )
}
