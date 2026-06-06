import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, Target, GitFork, Shield, Rocket, RefreshCw, TrendingUp, Clock, MapPin, Sparkles } from "lucide-react"
import { useLifeSimStore } from "@/store/useLifeSimStore"
import { useLifeSimNavigation } from "@/hooks/useLifeSimNavigation"
import type { Branch, StoryHistoryEntry } from "@/types"

const easeSmooth = [0.16, 1, 0.3, 1] as [number, number, number, number]
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeSmooth } } }

const branchIcons = [Shield, Rocket, RefreshCw]
const branchColors = ["#6366F1", "#22C55E", "#F59E0B"]

function RadarChart({ branches }: { branches: { name: string; scores: Record<string, number> }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dimensions = ["难度", "满意度", "风险", "成长"]
  const dimKeys = ["difficulty", "satisfaction", "risk", "growth"]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const size = 280
    canvas.width = size * dpr; canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    const cx = size / 2, cy = size / 2, r = 90, maxScore = 5
    const angleStep = (Math.PI * 2) / dimensions.length

    for (let level = 1; level <= maxScore; level++) {
      const rad = (r / maxScore) * level
      ctx.beginPath()
      for (let i = 0; i <= dimensions.length; i++) { const a = i * angleStep - Math.PI / 2; const x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) }
      ctx.strokeStyle = level === maxScore ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"; ctx.stroke()
    }
    for (let i = 0; i < dimensions.length; i++) {
      const a = i * angleStep - Math.PI / 2
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.stroke()
      ctx.fillStyle = "#8B8B9A"; ctx.font = "12px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"
      ctx.fillText(dimensions[i], cx + (r + 22) * Math.cos(a), cy + (r + 22) * Math.sin(a))
    }
    branches.forEach((branch, bi) => {
      const color = branchColors[bi]
      ctx.beginPath()
      dimKeys.forEach((key, i) => {
        const score = branch.scores[key] || 0, rad = (r / maxScore) * score, a = i * angleStep - Math.PI / 2
        i === 0 ? ctx.moveTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a)) : ctx.lineTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a))
      })
      ctx.closePath(); ctx.fillStyle = color + "20"; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke()
      dimKeys.forEach((key, i) => { const score = branch.scores[key] || 0, rad = (r / maxScore) * score, a = i * angleStep - Math.PI / 2; ctx.beginPath(); ctx.arc(cx + rad * Math.cos(a), cy + rad * Math.sin(a), 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill() })
    })
    const legendY = size - 20
    branches.forEach((branch, i) => {
      const lx = 30 + i * 90; ctx.beginPath(); ctx.arc(lx, legendY, 5, 0, Math.PI * 2); ctx.fillStyle = branchColors[i]; ctx.fill()
      ctx.fillStyle = "#8B8B9A"; ctx.font = "11px Inter, sans-serif"; ctx.textAlign = "left"; ctx.fillText(branch.name.slice(0, 4), lx + 10, legendY + 1)
    })
  }, [branches])

  return <canvas ref={canvasRef} className="w-full max-w-[280px] mx-auto" style={{ width: 280, height: 280 }} />
}

export default function ReportScreen() {
  const store = useLifeSimStore()
  const { goTo, restart } = useLifeSimNavigation()

  if (!store.scenarioData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="text-text-secondary">暂无报告数据</div>
        <button
          onClick={() => goTo("result")}
          className="px-4 py-2 rounded-xl bg-accent/15 text-accent text-sm hover:bg-accent/25 transition-colors"
        >
          返回推演结果
        </button>
      </div>
    )
  }

  const { userSummary, researchSummary, branches, recommendation, disclaimer } = store.scenarioData
  const userChoicesByBranch = branches.map((branch: Branch) => ({ branch, history: store.story.history.filter((h: StoryHistoryEntry) => h.branchId === branch.id) }))

  return (
    <div className="min-h-screen bg-background px-4 py-8 pb-12">
      <div className="max-w-[800px] mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-8">
          <button onClick={() => goTo(store.story.currentBranchId !== null ? "story" : "result")} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold text-text-primary">你的决策报告</h1>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={itemVariants} className="bg-background-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-accent" />用户画像</h2>
            <p className="text-sm text-text-primary leading-relaxed">{userSummary}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-background-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-warning" />关键洞察</h2>
            <p className="text-sm text-text-primary leading-relaxed">{researchSummary}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-background-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 pb-4"><h2 className="text-sm font-medium text-text-secondary flex items-center gap-2"><GitFork className="w-4 h-4 text-accent" />路径对比</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-t border-border">
                  <th className="text-left py-3 px-6 text-text-muted font-medium">维度</th>
                  {branches.map((branch: Branch, i: number) => { const Icon = branchIcons[i]; return <th key={branch.id} className="text-left py-3 px-4 text-text-primary font-medium"><div className="flex items-center gap-2"><Icon className="w-4 h-4" style={{ color: branchColors[i] }} />{branch.name}</div></th> })}
                </tr></thead>
                <tbody>
                  <tr className="border-t border-border"><td className="py-3 px-6 text-text-muted">优势</td>{branches.map((branch: Branch) => <td key={branch.id} className="py-3 px-4 text-text-primary"><div className="flex flex-wrap gap-1">{branch.pros.map((pro: string) => <span key={pro} className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">{pro}</span>)}</div></td>)}</tr>
                  <tr className="border-t border-border"><td className="py-3 px-6 text-text-muted">劣势</td>{branches.map((branch: Branch) => <td key={branch.id} className="py-3 px-4 text-text-primary"><div className="flex flex-wrap gap-1">{branch.cons.map((con: string) => <span key={con} className="text-xs px-2 py-0.5 bg-danger/10 text-danger rounded-full">{con}</span>)}</div></td>)}</tr>
                  <tr className="border-t border-border"><td className="py-3 px-6 text-text-muted">最佳情况</td>{branches.map((branch: Branch) => <td key={branch.id} className="py-3 px-4 text-text-primary text-xs">{branch.bestCase}</td>)}</tr>
                  <tr className="border-t border-border"><td className="py-3 px-6 text-text-muted">最坏情况</td>{branches.map((branch: Branch) => <td key={branch.id} className="py-3 px-4 text-text-primary text-xs">{branch.worstCase}</td>)}</tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-background-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-accent" />四维评分对比</h2>
            <RadarChart branches={branches} />
          </motion.div>

          {store.story.history.length > 0 && (
            <motion.div variants={itemVariants} className="bg-background-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" />你的选择记录</h2>
              <div className="space-y-4">
                {userChoicesByBranch.map(({ branch, history }: { branch: Branch; history: StoryHistoryEntry[] }) => history.length > 0 && (
                  <div key={branch.id}>
                    <h3 className="text-xs font-medium text-text-muted mb-2">{branch.name}</h3>
                    <div className="space-y-2">
                      {history.map((entry: StoryHistoryEntry, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background-elevated/50">
                          <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0"><span className="text-xs text-accent font-medium">{i + 1}</span></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1"><span className="text-xs text-text-muted"><Clock className="w-3 h-3 inline mr-1" />{entry.stage}</span></div>
                            <p className="text-sm text-text-primary">{entry.choiceText}</p>
                            <div className="flex gap-2 mt-1.5">
                              <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">{entry.strategy}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-background-elevated text-text-muted rounded-full">{entry.personality}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="bg-success/5 border border-success/20 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-success mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" />AI 推荐</h2>
            <p className="text-sm text-text-primary leading-relaxed mb-4">{recommendation.reasoning}</p>
            <div className="space-y-2">
              {recommendation.tips.map((tip: string, i: number) => <div key={i} className="flex items-start gap-2 text-sm text-text-secondary"><ArrowRight className="w-4 h-4 text-success shrink-0 mt-0.5" />{tip}</div>)}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-background-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" />关键行动清单</h2>
            <div className="space-y-0">
              {recommendation.actionChecklist.map((item: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs text-success font-semibold">{i + 1}</span></div>
                  <p className="text-sm text-text-primary">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-danger/5 border border-danger/20 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-danger mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 animate-pulse" />避坑指南</h2>
            <div className="space-y-3">
              {recommendation.pitfalls.map((pitfall: string, i: number) => <div key={i} className="flex items-start gap-3 text-sm text-text-primary"><AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />{pitfall}</div>)}
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-xs text-text-muted text-center py-4">{disclaimer}</motion.p>

          <motion.div variants={itemVariants} className="flex justify-center pb-8">
            <button onClick={restart} className="flex items-center gap-2 px-6 py-3 bg-background-elevated text-text-primary rounded-xl text-sm font-medium hover:bg-background-card border border-border hover:border-border-focus transition-all">
              <ArrowLeft className="w-4 h-4" />重新开始
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
