import { useState, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronDown, Upload, FileText, X, Sparkles, GraduationCap, Briefcase, Building2, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useLifeSimStore } from "@/store/useLifeSimStore"
import { decisionTypeOptions, providerOptions, defaultModels, defaultEndpoints } from "@/lib/config"
import { testApiConnection } from "@/lib/api"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const featureTags = [
  { icon: GraduationCap, label: "\u9009\u6821\u51b3\u7b56" },
  { icon: Briefcase, label: "\u804c\u4e1a\u9009\u62e9" },
  { icon: Building2, label: "\u57ce\u5e02\u5bf9\u6bd4" },
]

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const { apiConfig, decisionContext, profileFileName, setApiConfig, setDecisionContext, setProfileFile, switchScreen, clearChat } = useLifeSimStore()
  const [showApiKey, setShowApiKey] = useState(false)
  const [showImageKey, setShowImageKey] = useState(false)
  const [showDecisionContext, setShowDecisionContext] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProviderChange = (value: string) => {
    const model = defaultModels[value] || ""
    const endpoint = defaultEndpoints[value] || ""
    setApiConfig({
      provider: value as typeof apiConfig.provider,
      modelName: model,
      ...(endpoint ? { customEndpoint: endpoint } : {}),
    })
  }

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return
    if (file.size > 1024 * 1024) { alert("\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7 1MB"); return }
    const reader = new FileReader()
    reader.onload = (e) => { setProfileFile(file.name, (e.target?.result as string) || "") }
    reader.readAsText(file)
  }, [setProfileFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }, [handleFileChange])

  const handleStart = async () => {
    if (!apiConfig.apiKey.trim()) { alert("\u8bf7\u8f93\u5165 API Key"); return }
    if (!apiConfig.modelName.trim()) { alert("\u8bf7\u8f93\u5165\u6a21\u578b\u540d\u79f0"); return }
    if (apiConfig.provider === "custom" && !apiConfig.customEndpoint.trim()) {
      alert("\u8bf7\u8f93\u5165\u81ea\u5b9a\u4e49\u7aef\u70b9")
      return
    }
    setIsLoading(true)
    clearChat()
    try {
      await testApiConnection(apiConfig)
      switchScreen("chat")
      navigate("/chat")
    } catch (error) {
      alert(error instanceof Error ? error.message : "API \u8fde\u63a5\u5931\u8d25")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/welcome-bg.jpg`} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10" style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #3B6FAB 25%, #6366F1 50%, #3B6FAB 75%, #1E3A5F 100%)", backgroundSize: "200% 200%", animation: "liquid-flow 20s ease-in-out infinite" }} />

      <motion.div className="relative z-10 w-full max-w-[520px]" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}>
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="relative w-96 h-36 mx-auto mb-4">
            <img src={`${import.meta.env.BASE_URL}images/lifesim-logo.png`} alt="LifeSim" className="w-full h-full object-contain" />
          </div>
          <p className="text-text-secondary text-sm">AI 驱动的重大人生决策辅助工具</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center gap-3 mb-8">
          {featureTags.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/15 text-accent-hover">
              <Icon className="w-3.5 h-3.5" />{label}
            </span>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 bg-background-card/80 backdrop-blur-xl rounded-2xl border border-border p-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">API 提供商 <span className="text-danger">*</span></label>
            <div className="relative">
              <select value={apiConfig.provider} onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-xl bg-white border border-border text-black text-sm appearance-none focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
                {providerOptions.map((opt) => <option key={opt.value} value={opt.value} className="text-black bg-white">{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">API Key <span className="text-danger">*</span></label>
            <div className="relative">
              <input type={showApiKey ? "text" : "password"} value={apiConfig.apiKey} onChange={(e) => setApiConfig({ apiKey: e.target.value })} placeholder="sk-..."
                className="w-full h-11 px-4 pr-10 rounded-xl bg-white border border-border text-black text-sm placeholder:text-black/50 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
              <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-text-muted">Key 仅存储在本地浏览器，不会上传至任何服务器</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">模型名称</label>
            <input type="text" value={apiConfig.modelName} onChange={(e) => setApiConfig({ modelName: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-white border border-border text-black text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
          </div>

          {apiConfig.provider === "custom" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">自定义端点</label>
              <input type="text" value={apiConfig.customEndpoint} onChange={(e) => setApiConfig({ customEndpoint: e.target.value })} placeholder="https://..."
                className="w-full h-11 px-4 rounded-xl bg-white border border-border text-black text-sm placeholder:text-black/50 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => setShowDecisionContext((open) => !open)}
            className="relative w-full py-2 group"
            aria-expanded={showDecisionContext}
          >
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center items-center gap-1">
              <span className="px-3 text-xs text-text-muted bg-background-card group-hover:text-text-secondary transition-colors">选填：决策背景</span>
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showDecisionContext ? "rotate-180" : ""}`} />
            </div>
          </button>

          <motion.div
            initial={false}
            animate={{ height: showDecisionContext ? "auto" : 0, opacity: showDecisionContext ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">决策类型</label>
                <div className="relative">
                  <select value={decisionContext.decisionType} onChange={(e) => setDecisionContext({ decisionType: e.target.value as never })}
                    className="w-full h-11 px-4 pr-10 rounded-xl bg-white border border-border text-black text-sm appearance-none focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all">
                    {decisionTypeOptions.map((opt) => <option key={opt.value} value={opt.value} className="text-black bg-white">{opt.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">具体选项</label>
                <input type="text" value={decisionContext.decisionOptions} onChange={(e) => setDecisionContext({ decisionOptions: e.target.value })} placeholder="如：北京大学计算机 vs 清华大学软件工程"
                  className="w-full h-11 px-4 rounded-xl bg-white border border-border text-black text-sm placeholder:text-black/50 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">核心诉求</label>
                <input type="text" value={decisionContext.decisionPriority} onChange={(e) => setDecisionContext({ decisionPriority: e.target.value })} placeholder="如：保研率、学术氛围、导师资源"
                  className="w-full h-11 px-4 rounded-xl bg-white border border-border text-black text-sm placeholder:text-black/50 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">个人资料</label>
                <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onClick={() => fileInputRef.current?.click()}
                  className={`relative h-24 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${isDragging ? "border-accent bg-accent/5" : "border-border bg-background-secondary hover:border-border-focus/50"}`}>
                  <input ref={fileInputRef} type="file" accept=".txt,.md,.json" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} className="hidden" />
                  {profileFileName ? (
                    <div className="flex items-center gap-2 px-4">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-sm text-text-primary">{profileFileName}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setProfileFile("", "") }} className="text-text-muted hover:text-danger transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <><Upload className="w-5 h-5 text-text-muted" /><span className="text-xs text-text-muted text-center px-4">拖拽文件到此处，或点击上传<br />支持 txt/md/json，最大 1MB</span></>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">图像生成 Key（可选）</label>
                <div className="relative">
                  <input type={showImageKey ? "text" : "password"} value={apiConfig.imageApiKey} onChange={(e) => setApiConfig({ imageApiKey: e.target.value })} placeholder="通义万相 API Key"
                    className="w-full h-11 px-4 pr-10 rounded-xl bg-white border border-border text-black text-sm placeholder:text-black/50 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />
                  <button type="button" onClick={() => setShowImageKey(!showImageKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                    {showImageKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.button onClick={handleStart} disabled={!apiConfig.apiKey.trim() || isLoading}
            className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${apiConfig.apiKey.trim() && !isLoading ? "bg-accent text-[#E2E8F0] hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]" : "bg-background-elevated text-text-muted cursor-not-allowed"}`}
            whileHover={apiConfig.apiKey.trim() && !isLoading ? { y: -1 } : {}} whileTap={apiConfig.apiKey.trim() && !isLoading ? { scale: 0.98 } : {}}>
            {isLoading ? <div className="w-5 h-5 border-2 border-[#E2E8F0]/30 border-t-[#E2E8F0] rounded-full animate-spin" /> : <><Sparkles className="w-4 h-4" />开始探索<ArrowRight className="w-4 h-4" /></>}
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-xs text-text-muted mt-6">LifeSim v2.0 · 纯前端实现，数据仅存储在本地</motion.p>
      </motion.div>
    </div>
  )
}
