import { categories } from "@/data/categories"
import { CategoryCard } from "@/components/landing/CategoryCard"

export function CategorySection() {
  return (
    <section id="categorias" className="py-16 md:py-20">
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-3 md:mb-12">
          <p className="text-sm font-medium tracking-wider text-nexora uppercase">
            Departamentos
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Explore por categoria
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Encontre exatamente o que precisa — do processador ao periférico
            ideal para completar seu setup.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
