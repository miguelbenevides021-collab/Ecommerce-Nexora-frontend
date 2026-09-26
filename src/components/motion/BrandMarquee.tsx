const brands = [
  "NVIDIA",
  "AMD",
  "Intel",
  "ASUS",
  "MSI",
  "Corsair",
  "Logitech",
  "Samsung",
  "Kingston",
  "Razer",
  "Gigabyte",
  "Cooler Master",
]

export function BrandMarquee() {
  const loop = [...brands, ...brands]

  return (
    <div className="relative overflow-hidden border-b border-border/40 bg-secondary/20 py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
      <div className="marquee-track flex w-max gap-10">
        {loop.map((brand, index) => (
          <span
            key={`${brand}-${index}`}
            className="text-xs font-semibold tracking-[0.28em] text-muted-foreground/70 uppercase"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  )
}
