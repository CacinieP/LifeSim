import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Clock, MapPin, CheckCircle2, ChevronUp, ChevronDown, SkipForward, FileText, GitFork, Target, ListTodo, ImageOff } from "lucide-react"
import { useLifeSimStore } from "@/store/useLifeSimStore"
import { useLifeSimNavigation } from "@/hooks/useLifeSimNavigation"
import { generateImage } from "@/lib/api"

const easeSmooth = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function StoryScreen() {
  const store = useLifeSimStore()
  const { goTo, startStory } = useLifeSimNavigation()
  const [displayText, setDisplayText] = useState("")
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [showMeta, setShowMeta] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [stageImageUrl, setStageImageUrl] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const imageCacheRef = useRef<Record<string, string>>({})
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)

  const scenarioData = store.scenarioData
  const branchId = store.story.currentBranchId
  const branch = scenarioData?.branches.find((b) => b.id === branchId)
  const currentStage = branch?.stages[store.story.currentStageIndex]
  const isLastStage = branch ? store.story.currentStageIndex >= branch.stages.length - 1 : false

  useEffect(() => {
    if (!currentStage) return

    const cacheKey = `${store.story.currentBranchId}-${store.story.currentStageIndex}`
    setStageImageUrl(null)
    setImageLoaded(false)
    setImageError(false)

    if (currentStage.imageUrl) {
      setStageImageUrl(currentStage.imageUrl)
      return
    }

    if (imageCacheRef.current[cacheKey]) {
      setStageImageUrl(imageCacheRef.current[cacheKey])
      return
    }

    const { apiConfig } = store
    if (apiConfig.imageProvider === "none") return

    const apiKey = apiConfig.imageApiKey.trim() || apiConfig.apiKey.trim()
    if (!apiKey) return

    let cancelled = false
    setIsGeneratingImage(true)

    const prompt = `写实电影感插画，${currentStage.stage}，${currentStage.scene.slice(0, 180)}`
    void generateImage(apiConfig, prompt)
      .then((url) => {
        if (cancelled) return
        imageCacheRef.current[cacheKey] = url
        setStageImageUrl(url)
      })
      .catch(() => {
        if (!cancelled) setStageImageUrl(null)
      })
      .finally(() => {
        if (!cancelled) setIsGeneratingImage(false)
      })

    return () => { cancelled = true }
  }, [currentStage, store.story.currentBranchId, store.story.currentStageIndex, store.apiConfig])

  useEffect(() => {
    if (!currentStage) return
    setDisplayText("")
    setShowChoices(false)
    setShowMeta(false)
    setIsComplete(false)
    let index = 0
    const type = () => {
      if (index < currentStage.scene.length) {
        setDisplayText(currentStage.scene.slice(0, index + 1))
        index++
        typingRef.current = setTimeout(type, 30)
      } else {
        setShowMeta(true)
        setTimeout(() => setShowChoices(true), 300)
      }
    }
    typingRef.current = setTimeout(type, 500)
    return () => { if (typingRef.current) clearTimeout(typingRef.current) }
  }, [store.story.currentBranchId, store.story.currentStageIndex, currentStage])

  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight
    }
  }, [displayText])

  const handleSkip = useCallback(() => {
    if (typingRef.current) clearTimeout(typingRef.current)
    setDisplayText(currentStage?.scene || "")
    setShowMeta(true)
    setShowChoices(true)
    store.skipTyping()
  }, [currentStage, store])

  const handleChoice = (choiceIndex: number) => {
    if (isLastStage) setIsComplete(true)
    store.makeChoice(choiceIndex)
  }

  const handleViewReport = () => goTo("report")

  const handleTryOther = () => {
    const otherBranch = scenarioData?.branches.find((b) => !store.story.completedBranches.includes(b.id))
    if (otherBranch) startStory(otherBranch.id)
  }

  if (!scenarioData || branchId === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="text-text-secondary">请先选择一条路径</div>
        <button
          onClick={() => goTo("result")}
          className="px-4 py-2 rounded-xl bg-accent/15 text-accent text-sm hover:bg-accent/25 transition-colors"
        >
          返回推演结果
        </button>
      </div>
    )
  }

  if (!branch || !currentStage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="text-text-secondary">路径数据异常</div>
        <button
          onClick={() => goTo("result")}
          className="px-4 py-2 rounded-xl bg-accent/15 text-accent text-sm hover:bg-accent/25 transition-colors"
        >
          返回推演结果
        </button>
      </div>
    )
  }

  const branchProgress = branch.stages.length > 0
    ? ((store.story.currentStageIndex + (isComplete ? 1 : 0)) / branch.stages.length) * 100
    : 0

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="glass-nav h-14 flex items-center justify-between px-4 shrink-0 z-20">
        <button onClick={() => goTo("result")} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex items-center gap-2 text-sm"><GitFork className="w-4 h-4 text-accent" /><span className="text-text-secondary">{branch.name}</span><span className="text-text-muted">·</span><span className="text-text-muted">{store.story.currentStageIndex + 1}/{branch.stages.length}</span></div>
        <button onClick={handleViewReport} className="flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors text-sm"><FileText className="w-4 h-4" /><span className="hidden sm:inline">报告</span></button>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-6 gap-4">
        <AnimatePresence mode="wait">
          <motion.div key={`${store.story.currentBranchId}-${store.story.currentStageIndex}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-medium border border-accent/20">{currentStage.stage}</span>
            <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="w-3 h-3" />{currentStage.period}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={`cg-${store.story.currentBranchId}-${store.story.currentStageIndex}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5, ease: easeSmooth }}
            className="relative w-full max-w-[900px] aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {(isGeneratingImage || (stageImageUrl && !imageLoaded && !imageError)) && <div className="absolute inset-0 shimmer" />}
            {isGeneratingImage && !stageImageUrl && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-text-muted">正在生成场景图...</div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-text-muted bg-background/40">
                <ImageOff className="w-8 h-8 opacity-50" />
                <span>场景图加载失败</span>
              </div>
            )}
            {stageImageUrl && !imageError && (
              <img src={stageImageUrl} alt={currentStage.stage} className="w-full h-full object-cover" onLoad={() => setImageLoaded(true)} onError={() => { setImageLoaded(true); setImageError(true); }} />
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={`text-${store.story.currentBranchId}-${store.story.currentStageIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full max-w-[800px] glass-panel rounded-2xl p-5">
            <div ref={textContainerRef} className="max-h-[160px] overflow-y-auto text-sm leading-relaxed text-text-primary font-mono mb-3">
              {displayText}
              {!showChoices && displayText.length > 0 && <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 animate-pulse" />}
            </div>
            {!showChoices && displayText.length > 0 && (
              <button onClick={handleSkip} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"><SkipForward className="w-3 h-3" />跳过</button>
            )}
            <AnimatePresence>
              {showMeta && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div><span className="text-xs text-text-muted">关键节点</span><p className="text-sm text-text-primary">{currentStage.milestone}</p></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ListTodo className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div><span className="text-xs text-text-muted">阶段行动</span>
                      <ul className="mt-1 space-y-1">
                        {currentStage.actionItems.map((item, i) => <li key={i} className="text-sm text-text-primary flex items-start gap-2"><span className="text-accent">{i + 1}.</span>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showChoices && !isComplete && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4, ease: easeSmooth }} className="w-full max-w-[800px] space-y-3">
              <p className="text-xs text-text-muted text-center mb-2">你的选择</p>
              {currentStage.choices.map((choice, index) => (
                <motion.button key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, boxShadow: "0 4px 24px rgba(99, 102, 241, 0.2)" }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(index)}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-background-card/85 border border-border backdrop-blur-xl hover:border-accent hover:bg-accent/10 transition-all text-left">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary mb-2">{choice.text}</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${choice.strategy === "激进冒险" ? "bg-danger/15 text-danger" : choice.strategy === "保守稳健" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{choice.strategy}</span>
                  </div>
                  <span className="text-xs text-text-muted ml-4 shrink-0">{choice.personality}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[800px] text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-success" /></div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">「{branch.name}」体验完毕</h3>
              <p className="text-sm text-text-secondary mb-6">你的选择展现了{store.story.history[store.story.history.length - 1]?.personality || "独特"}的特质</p>
              <div className="flex gap-3 justify-center">
                {scenarioData.branches.some((b) => !store.story.completedBranches.includes(b.id)) && (
                  <button onClick={handleTryOther} className="px-5 py-2.5 rounded-xl border border-border text-text-primary text-sm font-medium hover:bg-background-elevated transition-colors">体验其他路线</button>
                )}
                <button onClick={handleViewReport} className="px-5 py-2.5 rounded-xl bg-accent text-[#E2E8F0] text-sm font-medium hover:bg-accent-hover transition-colors">查看报告</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-16" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="flex justify-center">
          <button onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-t-xl bg-background-card/95 backdrop-blur-xl border border-b-0 border-border text-xs text-text-muted hover:text-text-primary transition-colors">
            <MapPin className="w-3.5 h-3.5" />时间轴{isTimelineOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
        <AnimatePresence>
          {isTimelineOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: easeSmooth }}
              className="bg-background-card/95 backdrop-blur-xl border-t border-border overflow-hidden">
              <div className="max-w-[800px] mx-auto px-4 py-5">
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-text-muted mb-1.5"><span>进度</span><span>{Math.round(branchProgress)}%</span></div>
                  <div className="h-1.5 rounded-full bg-background-elevated">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-accent to-[#8184F7]" initial={{ width: 0 }} animate={{ width: `${branchProgress}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {branch.stages.map((stage, index) => {
                    const historyEntry = store.story.history.find((h) => h.branchId === store.story.currentBranchId && h.stageIndex === index)
                    const isActive = index === store.story.currentStageIndex
                    const isVisited = index < store.story.currentStageIndex
                    return (
                      <div key={index} className="flex items-center shrink-0">
                        {index > 0 && <div className={`w-6 h-0.5 ${isVisited ? "bg-gradient-to-r from-success to-accent" : "bg-border"}`} />}
                        <div className={`relative w-3 h-3 rounded-full shrink-0 ${isActive ? "bg-accent shadow-lg shadow-accent/50" : isVisited ? "bg-success" : "bg-background-elevated border border-border"}`}>
                          {isActive && <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />}
                        </div>
                        <div className="ml-2 mr-4 shrink-0">
                          <p className={`text-xs ${isActive ? "text-accent font-medium" : isVisited ? "text-success" : "text-text-muted"}`}>{stage.stage}</p>
                          {historyEntry && <p className="text-[10px] text-text-muted max-w-[120px] truncate">{historyEntry.choiceText}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
