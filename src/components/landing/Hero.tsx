import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Shield, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroimage from "../../assets//fotohero2.jpg";
const highlights = [
  { icon: Truck, label: "Entrega em 48h" },
  { icon: Shield, label: "Garantia oficial" },
  { icon: Cpu, label: "Hardware premium" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 grid-pattern" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-nexora/8 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-nexora/5 blur-3xl" />

      <div className="section-container relative py-12 md:py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col gap-6 md:gap-8">
            <Badge variant="nexora" className="w-fit gap-1.5 px-3 py-1">
              <Zap className="size-3" />
              Nova geração de hardware
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Tecnologia para{" "}
                <span className="text-nexora nexora-text-glow">ir além.</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Componentes de alta performance, entrega rápida e suporte
                especializado. Monte o setup dos seus sonhos com a confiança que
                só a Nexora oferece.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                render={<Link to="/produtos" />}
                size="lg"
                className="h-11 bg-nexora px-6 text-primary-foreground hover:bg-nexora/90"
              >
                Comprar agora
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                render={<Link to="/produtos" />}
                variant="outline"
                size="lg"
                className="h-11 border-border/60 px-6 hover:border-nexora/40 hover:bg-nexora/5"
              >
                Explorar produtos
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {highlights.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="flex size-7 items-center justify-center rounded-md border border-border/60 bg-secondary/50">
                    <Icon className="size-3.5 text-nexora" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-card/50 md:aspect-[4/3] lg:aspect-square">
              <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-nexora/10 via-transparent to-transparent" />

              <img
                src={heroimage}
                alt="Placa de vídeo GeForce RTX em destaque"
                className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                loading="eager"
              />

              {/* Floating info cards */}
              <div className="absolute top-4 left-4 z-20 rounded-lg border border-border/60 bg-background/90 px-3 py-2 backdrop-blur-sm">
                <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                  Destaque
                </p>
                <p className="text-sm font-semibold">Computador Gamer</p>
              </div>

              <div className="absolute right-4 bottom-4 z-20 rounded-lg border border-nexora/30 bg-background/90 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground line-through">
                  R$ 5.499,99
                </p>
                <p className="text-xl font-bold text-nexora">R$ 4.299,99</p>
                <p className="text-[11px] text-emerald-400">22% OFF</p>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl border border-nexora/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
