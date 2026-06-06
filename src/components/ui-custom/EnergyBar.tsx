import { useEffect, useRef, useState } from "react"

interface EnergyBarProps {
  value: number
  max?: number
  label: string
  unit?: string
  vertical?: boolean
  className?: string
  delay?: number
}

export default function EnergyBar({ value, max = 5, label, unit = "", vertical = true, className = "", delay = 0 }: EnergyBarProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const percentage = (value / max) * 100

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => setIsVisible(true), delay); observer.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  useEffect(() => {
    if (!isVisible) return
    const duration = 1200
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(eased * value * 10) / 10)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, value])

  if (vertical) {
    return (
      <div ref={ref} className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="text-xs font-medium tracking-wide" style={{ color: "#00E5FF" }}>{label}</div>
        <div className="relative rounded-sm overflow-hidden" style={{ width: "24px", height: "120px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(16,20,36,0.6)" }}>
          {[0, 25, 50, 75, 100].map((tick) => (
            <div key={tick} className="absolute right-0" style={{ bottom: `${tick}%`, width: "6px", height: "1px", background: "rgba(0,229,255,0.3)", transform: "translateY(-50%)" }} />
          ))}
          <div className="absolute bottom-0 left-0 w-full transition-all" style={{ height: isVisible ? `${percentage}%` : "0%", transitionDuration: "1.2s", transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)", background: "linear-gradient(180deg,#00E5FF,#0288D1)", boxShadow: "0 0 10px rgba(0,229,255,0.3)" }} />
        </div>
        <div className="text-sm font-semibold text-[#E2E8F0] tabular-nums">{displayValue.toFixed(1)}{unit}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        {label && <span className="text-xs font-medium tracking-wide" style={{ color: "#00E5FF" }}>{label}</span>}
        <span className="text-sm font-semibold text-[#E2E8F0] tabular-nums">{displayValue.toFixed(1)}{unit}</span>
      </div>
      <div className="relative rounded-sm overflow-hidden" style={{ height: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(16,20,36,0.6)" }}>
        <div className="absolute top-0 left-0 h-full transition-all" style={{ width: isVisible ? `${percentage}%` : "0%", transitionDuration: "1.2s", transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)", background: "linear-gradient(180deg,#00E5FF,#0288D1)", boxShadow: "0 0 10px rgba(0,229,255,0.3)" }} />
      </div>
    </div>
  )
}
