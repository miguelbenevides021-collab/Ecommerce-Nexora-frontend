import { useState, type FormEvent } from "react"
import { Check, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const perks = ["Ofertas exclusivas", "Lançamentos", "Promoções", "Novidades"]

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section className="py-16 md:py-20">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 px-6 py-10 md:px-12 md:py-14">
          <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-nexora/8 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-nexora/30 bg-nexora/10">
              <Mail className="size-5 text-nexora" />
            </span>

            <h2 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
              Fique por dentro da Nexora.
            </h2>
            <p className="mb-6 text-muted-foreground">
              Receba em primeira mão as melhores ofertas, lançamentos e
              novidades do universo tech.
            </p>

            <ul className="mb-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Check className="size-3.5 text-nexora" />
                  {perk}
                </li>
              ))}
            </ul>

            {submitted ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                <Check className="size-4" />
                Inscrição confirmada! Em breve você receberá nossas novidades.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="E-mail para newsletter"
                  className="h-11 flex-1 border-border/60 bg-secondary/50"
                />
                <Button
                  type="submit"
                  className="h-11 shrink-0 bg-nexora px-6 text-primary-foreground hover:bg-nexora/90"
                >
                  Inscrever-se
                  <Send className="size-4" data-icon="inline-end" />
                </Button>
              </form>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              Sem spam. Cancele quando quiser.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
