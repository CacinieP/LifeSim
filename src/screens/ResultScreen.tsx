import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react"
import EnergyBar from "@/components/ui-custom/EnergyBar"
import { useLifeSimStore } from "@/store/useLifeSimStore"

export default function ResultScreen() {
  const store = useLifeSimStore()
  const [animateScores, setAnimateScores] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimateScores(true), 800)
    return () => clearTimeout(t)
  }, [])

  if (!store.scenarioData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#06060D" }}>
        <div style={{ color: "rgba(255,255,255,0.5)" }}>暂无模拟数据</div>
      </div>
    )
  }

  const { userSummary, researchSummary, branches, recommendation } = store.scenarioData

  return (
    <div className="min-h-screen" style={{ background: "#06060D" }}>
      <div className="sticky top-0 z-50 px-6 py-4" style={{ background: "rgba(6, 6, 13, 0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#E2E8F0]">推演结果</h1>
          <button onClick={() => store.switchScreen("report")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(157, 78, 221, 0.15))", border: "1px solid rgba(0, 229, 255, 0.3)", color: "#00E5FF" }}>
            查看报告
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="rounded-2xl p-6" style={{ background: "rgba(16, 20, 36, 0.4)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <h3 className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: "#00E5FF" }}><Sparkles className="w-4 h-4" />用户画像</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>{userSummary}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl p-6" style={{ background: "rgba(16, 20, 36, 0.4)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <h3 className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: "#00E5FF" }}><TrendingUp className="w-4 h-4" />研究洞察</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>{researchSummary}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(157, 78, 221, 0.08))", border: "1px solid rgba(0, 229, 255, 0.2)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)" }} />
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #00E5FF, #9D4EDD)" }}>
              <CheckCircle2 className="w-5 h-5" style={{ color: "#06060D" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E2E8F0] mb-1">AI 推荐路径</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.7)" }}>{recommendation.reasoning}</p>
            </div>
          </div>
        </motion.div>

        <div>
          <h2 className="text-sm font-medium mb-4 tracking-wide" style={{ color: "rgba(255, 255, 255, 0.6)" }}>选择一条路径开始体验</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((branch, i) => (
              <motion.div key={branch.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                onClick={() => store.startStory(branch.id)}
                className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden"
                style={{ background: "rgba(16, 20, 36, 0.4)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                {branch.id === recommendation.primaryId && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "linear-gradient(135deg, #00E5FF, #9D4EDD)", color: "#06060D" }}>推荐</div>
                )}
                <div className="text-3xl mb-3">{branch.icon}</div>
                <h3 className="text-base font-semibold text-[#E2E8F0] mb-1">{branch.name}</h3>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.6)" }}>{branch.shortDesc}</p>

                <div className="space-y-2 mb-4">
                  <EnergyBar value={branch.scores.difficulty} label="难度" max={5} vertical={false} delay={i * 200} />
                  <EnergyBar value={branch.scores.satisfaction} label="满意度" max={5} vertical={false} delay={i * 200 + 100} />
                  <EnergyBar value={branch.scores.risk} label="风险" max={5} vertical={false} delay={i * 200 + 200} />
                  <EnergyBar value={branch.scores.growth} label="成长" max={5} vertical={false} delay={i * 200 + 300} />
                </div>

                <div className="space-y-1.5 mb-4">
                  {branch.pros.slice(0, 2).map((pro: string, j: number) => (
                    <div key={j} className="flex items-start gap-1.5"><span className="text-xs mt-0.5" style={{ color: "#00E676" }}>+</span><span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>{pro}</span></div>
                  ))}
                  {branch.cons.slice(0, 1).map((con: string, j: number) => (
                    <div key={j} className="flex items-start gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "#FF1744" }} /><span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>{con}</span></div>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#00E5FF" }}>
                  体验此路径<ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
