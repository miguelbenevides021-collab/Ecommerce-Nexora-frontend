import {
  CreditCard,
  Headphones,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react"
import type { Benefit, FooterLinkGroup } from "@/types"

export const benefits: Benefit[] = [
  {
    id: "frete",
    title: "Frete rápido",
    description: "Entrega expressa para todo o Brasil em até 48h",
    icon: Truck,
  },
  {
    id: "compra-segura",
    title: "Compra segura",
    description: "Ambiente protegido com criptografia de ponta a ponta",
    icon: ShieldCheck,
  },
  {
    id: "garantia",
    title: "Garantia estendida",
    description: "Até 3 anos de cobertura em produtos selecionados",
    icon: Wrench,
  },
  {
    id: "suporte",
    title: "Suporte especializado",
    description: "Equipe técnica pronta para montar seu setup ideal",
    icon: Headphones,
  },
  {
    id: "pagamento",
    title: "Pagamento seguro",
    description: "Pix, cartão em até 12x e boleto com total proteção",
    icon: CreditCard,
  },
]

export const footerLinks: FooterLinkGroup[] = [
  {
    title: "Institucional",
    links: [
      { label: "Sobre a Nexora", href: "#" },
      { label: "Trabalhe conosco", href: "#" },
      { label: "Blog de tecnologia", href: "#" },
      { label: "Sustentabilidade", href: "#" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Rastrear pedido", href: "#" },
      { label: "Trocas e devoluções", href: "#" },
      { label: "Fale conosco", href: "#" },
    ],
  },
  {
    title: "Políticas",
    links: [
      { label: "Privacidade", href: "#" },
      { label: "Termos de uso", href: "#" },
      { label: "Política de cookies", href: "#" },
      { label: "Garantia legal", href: "#" },
    ],
  },
  {
    title: "Categorias",
    links: [
      { label: "Processadores", href: "/produtos?categoria=Processadores" },
      { label: "Placas de vídeo", href: "/produtos?categoria=Placas de vídeo" },
      { label: "Notebooks", href: "/produtos?categoria=Notebooks" },
      { label: "PC Gamer", href: "/produtos" },
    ],
  },
]

export const paymentMethods = [
  "Visa",
  "Mastercard",
  "Elo",
  "Pix",
  "Boleto",
  "Amex",
]
