export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function calculateDiscount(oldPrice: number, currentPrice: number): number {
  return Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
}
