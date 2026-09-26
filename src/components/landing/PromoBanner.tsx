import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import setupcompleto from "../../assets/setupcompleto.webp";
export function PromoBanner() {
  return (
    <section className="py-16 md:py-20">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl border border-nexora/20 bg-card">
          {/* Background */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-nexora/15 via-transparent to-nexora/5" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-nexora/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />

          <div className="relative grid items-center gap-8 p-6 md:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
            <div className="flex flex-col gap-5">
              <Badge variant="nexora" className="w-fit gap-1.5">
                <Sparkles className="size-3" />
                Promoção exclusiva
              </Badge>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
                  Upgrade seu setup
                </h2>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                  Performance para quem não aceita limites. Monte um PC gamer
                  completo com até{" "}
                  <span className="font-semibold text-emerald-400">
                    35% de desconto
                  </span>{" "}
                  em kits selecionados.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  render={<Link to="/produtos" />}
                  size="lg"
                  className="h-11 bg-nexora px-6 text-primary-foreground hover:bg-nexora/90"
                >
                  Montar meu PC
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  ou{" "}
                  <Link
                    to="/produtos"
                    className="text-nexora underline-offset-4 hover:underline"
                  >
                    veja os kits prontos
                  </Link>
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-xl border border-border/40 bg-background/50 p-4 backdrop-blur-sm">
                <img
                  src={setupcompleto}
                  alt="Setup gamer completo com monitor e periféricos"
                  loading="lazy"
                  className="aspect-4/3 w-full rounded-lg object-cover"
                />

                <div className="absolute bottom-6 left-6 rounded-lg border border-emerald-500/30 bg-background/95 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground">Kit Gamer Pro</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-emerald-400">
                      -35%
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      R$ 12.999
                    </span>
                  </div>
                  <p className="text-xl font-bold">R$ 8.449,00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
