import {
  Cpu,
  Gpu,
  HardDrive,
  Keyboard,
  Laptop,
  MemoryStick,
  Monitor,
  Gamepad2,
} from "lucide-react"
import type { Category } from "@/types"

export const categories: Category[] = [
  {
    id: "processadores",
    name: "Processadores",
    description: "Potência multicore para qualquer workload",
    icon: Cpu,
    href: "/produtos?categoria=Processadores",
  },
  {
    id: "placas-video",
    name: "Placas de vídeo",
    description: "Ray tracing e FPS elevados",
    icon: Gpu,
    href: "/produtos?categoria=Placas de vídeo",
  },
  {
    id: "memoria-ram",
    name: "Memória RAM",
    description: "DDR5 de alta velocidade",
    icon: MemoryStick,
    href: "/produtos?categoria=Memória RAM",
  },
  {
    id: "ssds",
    name: "SSDs",
    description: "Armazenamento NVMe ultrarrápido",
    icon: HardDrive,
    href: "/produtos?categoria=SSDs",
  },
  {
    id: "notebooks",
    name: "Notebooks",
    description: "Mobilidade sem abrir mão de performance",
    icon: Laptop,
    href: "/produtos?categoria=Notebooks",
  },
  {
    id: "monitores",
    name: "Monitores",
    description: "Alta taxa de refresh e cores precisas",
    icon: Monitor,
    href: "/produtos?categoria=Monitores",
  },
  {
    id: "perifericos",
    name: "Periféricos",
    description: "Teclados, mouses e headsets premium",
    icon: Keyboard,
    href: "/produtos?categoria=Periféricos",
  },
  {
    id: "pc-gamer",
    name: "PC Gamer",
    description: "Setups completos prontos para jogar",
    icon: Gamepad2,
    href: "/produtos",
  },
]
