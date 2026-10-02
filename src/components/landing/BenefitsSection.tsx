import { benefits } from "@/data/site"
import { Reveal } from "@/components/motion/Reveal"

export function BenefitsSection() {
  return (
    <section className="border-y border-border/40 py-14 md:py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map(({ id, title, description, icon: Icon }, index) => (
            <Reveal key={id} delay={index * 60}>
            <div
              className="group flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
            >
              <span className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-secondary/30 transition-colors group-hover:border-nexora/30 group-hover:bg-nexora/10">
                <Icon className="size-5 text-nexora" />
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
