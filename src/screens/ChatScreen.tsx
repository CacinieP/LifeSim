import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trash2, Send, Sparkles, Bot, User } from "lucide-react"
import { useLifeSimStore } from "@/store/useLifeSimStore"
import { buildSystemPrompt, chatCompletion, generateScenarioData } from "@/lib/api"
import type { ChatMessage } from "@/types"

export default function ChatScreen() {
  const navigate = useNavigate()
  const store = useLifeSimStore()
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initializedRef = useRef(false)

  const scrollToBottom = useCallback(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [])
  useEffect(() => { scrollToBottom() }, [store.chatHistory, scrollToBottom])

  const systemPrompt = buildSystemPrompt(store.decisionContext, store.profileFileContent)

  const requestAssistantReply = useCallback(async (history: ChatMessage[]) => {
    store.setChatLoading(true)
    try {
      const reply = await chatCompletion(store.apiConfig, history, systemPrompt)
      store.appendChatMessage({ role: "assistant", content: reply })
      const userCount = history.filter((m) => m.role === "user").length
      if (userCount >= 3) store.setShowSimulateButton(true)
    } catch (error) {
      store.appendChatMessage({
        role: "assistant",
        content: `请求失败：${error instanceof Error ? error.message : "未知错误"}`,
      })
    } finally {
      store.setChatLoading(false)
    }
  }, [store, systemPrompt])

  useEffect(() => {
    if (initializedRef.current || store.chatHistory.length > 0) return
    initializedRef.current = true
    const opener: ChatMessage = { role: "user", content: "你好，我想聊聊我正在面临的人生选择。" }
    void requestAssistantReply([opener])
  }, [store.chatHistory.length, requestAssistantReply])

  const handleSend = async () => {
    if (!inputText.trim() || store.isChatLoading) return
    const userMessage: ChatMessage = { role: "user", content: inputText.trim() }
    const nextHistory = [...store.chatHistory, userMessage]
    store.appendChatMessage(userMessage)
    setInputText("")
    await requestAssistantReply(nextHistory)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleStartSimulation = async () => {
    if (store.isSimulating) return
    store.setSimulating(true)
    try {
      const data = await generateScenarioData(
        store.apiConfig,
        store.chatHistory,
        store.decisionContext,
        store.profileFileContent,
      )
      store.setScenarioData(data)
      store.switchScreen("result")
      navigate("/result")
    } catch (error) {
      alert(error instanceof Error ? error.message : "生成推演数据失败")
    } finally {
      store.setSimulating(false)
    }
  }

  const handleBack = () => {
    store.clearChat()
    store.switchScreen("welcome")
    navigate("/")
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [inputText])

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="glass-nav h-14 flex items-center justify-between px-4 shrink-0 z-20">
        <button onClick={handleBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /><span className="text-sm">返回</span></button>
        <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-accent" /><span className="font-semibold text-text-primary">与未来对话</span></div>
        <button onClick={handleBack} className="flex items-center gap-1.5 text-text-muted hover:text-danger transition-colors text-sm"><Trash2 className="w-4 h-4" /><span>清空</span></button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {store.chatHistory.length === 0 && store.isChatLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4"><Bot className="w-8 h-8 text-accent" /></div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">正在连接模型...</h2>
            <p className="text-sm text-text-secondary max-w-xs">使用 {store.apiConfig.modelName} 建立对话</p>
          </motion.div>
        )}

        {store.chatHistory.map((msg: ChatMessage, index: number) => (
          <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent" : "bg-accent/15"}`}>
                {msg.role === "user" ? <User className="w-4 h-4 text-[#E2E8F0]" /> : <Bot className="w-4 h-4 text-accent" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-accent text-[#E2E8F0] rounded-br-sm" : "bg-background-card border border-border text-text-primary rounded-bl-sm"}`}>{msg.content}</div>
            </div>
          </motion.div>
        ))}

        {store.isChatLoading && store.chatHistory.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-accent" /></div>
              <div className="px-4 py-3 rounded-2xl bg-background-card border border-border rounded-bl-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {store.showSimulateButton && !store.isChatLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex justify-center py-4">
              <button
                onClick={() => void handleStartSimulation()}
                disabled={store.isSimulating}
                className="flex items-center gap-2 px-6 py-3 bg-success/15 text-success rounded-xl font-semibold text-sm border border-success/30 hover:bg-success/25 hover:shadow-lg hover:shadow-success/20 transition-all disabled:opacity-60"
              >
                {store.isSimulating ? (
                  <div className="w-4 h-4 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {store.isSimulating ? "正在生成推演..." : "开始模拟"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-border bg-background-card/50 backdrop-blur-xl px-4 py-3 z-20">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <textarea ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder="写下你的想法..." rows={1} disabled={store.isChatLoading || store.isSimulating}
            className="flex-1 min-h-[44px] max-h-[120px] px-4 py-2.5 rounded-xl bg-white border border-border text-black text-sm placeholder:text-black/50 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none resize-none transition-all disabled:opacity-50" />
          <button onClick={() => void handleSend()} disabled={!inputText.trim() || store.isChatLoading || store.isSimulating}
            className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${inputText.trim() && !store.isChatLoading && !store.isSimulating ? "bg-accent text-[#E2E8F0] hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25" : "bg-background-elevated text-text-muted cursor-not-allowed"}`}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
