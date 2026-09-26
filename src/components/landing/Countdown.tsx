import { useEffect, useState } from "react"

interface TimeLeft {
  hours: string
  minutes: string
  seconds: string
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  }
}

export function Countdown() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 36 + 1000 * 60 * 24)
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(target))

  useEffect(() => {
    const id = window.setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const units: { label: string; value: string }[] = [
    { label: "Horas", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Seg", value: time.seconds },
  ]

  return (
    <div className="flex items-center gap-2" aria-label="Tempo restante da promoção">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="min-w-14 rounded-lg border border-nexora/25 bg-background/80 px-2 py-1.5 text-center backdrop-blur-sm">
            <p className="font-mono text-lg font-bold tabular-nums text-nexora">
              {unit.value}
            </p>
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
              {unit.label}
            </p>
          </div>
          {index < units.length - 1 && (
            <span className="text-nexora/60">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
