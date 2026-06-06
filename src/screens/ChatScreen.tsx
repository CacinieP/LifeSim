import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trash2, Send, Sparkles, Bot, User } from "lucide-react"
import { useLifeSimStore } from "@/store/useLifeSimStore"
import { demoChatHistory, demoScenarioData } from "@/lib/demoData"
import type { ChatMessage } from "@/types"

export default function ChatScreen() {
  const store = useLifeSimStore()
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [])
  useEffect(() => { scrollToBottom() }, [store.chatHistory, scrollToBottom])

  useEffect(() => {
    if (store.chatHistory.length === 0) {
      let delay = 0
      demoChatHistory.forEach((msg: ChatMessage, index: number) => {
        if (msg.role === "assistant") {
          delay += 600
          setTimeout(() => {
            store.appendChatMessage(msg)
            if (index === demoChatHistory.length - 1) setTimeout(() => store.setShowSimulateButton(true), 500)
          }, delay)
        } else {
          delay += 400
          setTimeout(() => store.appendChatMessage(msg), delay)
        }
      })
    }
  }, [store.chatHistory.length])

  const handleSend = () => {
    if (!inputText.trim() || store.isChatLoading) return
    store.appendChatMessage({ role: "user", content: inputText.trim() })
    setInputText("")
    store.setChatLoading(true)
    setTimeout(() => { store.setChatLoading(false); if (store.chatHistory.length >= 6) store.setShowSimulateButton(true) }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }

  const handleStartSimulation = () => {
    store.setSimulating(true)
    setTimeout(() => { store.setScenarioData(demoScenarioData); store.setSimulating(false); store.switchScreen("result") }, 2000)
  }

  const handleBack = () => { store.clearChat(); store.switchScreen("welcome") }

  useEffect(() => { if (inputRef.current) { inputRef.current.style.height = "auto"; inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px" } }, [inputText])

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="glass-nav h-14 flex items-center justify-between px-4 shrink-0 z-20">
        <button onClick={handleBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"><ArrowLeft className="w-5 h-5" /><span className="text-sm">返回</span></button>
        <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-accent" /><span className="font-semibold text-text-primary">与未来对话</span></div>
        <button onClick={handleBack} className="flex items-center gap-1.5 text-text-muted hover:text-danger transition-colors text-sm"><Trash2 className="w-4 h-4" /><span>清空</span></button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {store.chatHistory.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4"><Bot className="w-8 h-8 text-accent" /></div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">开始对话</h2>
            <p className="text-sm text-text-secondary max-w-xs">向「未来」描述你面临的决策困境，TA 会通过提问帮你理清思路</p>
          </motion.div>
        )}

        {store.chatHistory.map((msg: ChatMessage, index: number) => (
          <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent" : "bg-accent/15"}`}>
                {msg.role === "user" ? <User className="w-4 h-4 text-[#E2E8F0]" /> : <Bot className="w-4 h-4 text-accent" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-accent text-[#E2E8F0] rounded-br-sm" : "bg-background-card border border-border text-text-primary rounded-bl-sm"}`}>{msg.content}</div>
            </div>
          </motion.div>
        ))}

        {store.isChatLoading && (
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
              <button onClick={handleStartSimulation} className="flex items-center gap-2 px-6 py-3 bg-success/15 text-success rounded-xl font-semibold text-sm border border-success/30 hover:bg-success/25 hover:shadow-lg hover:shadow-success/20 transition-all">
                <Sparkles className="w-4 h-4" />开始模拟
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-border bg-background-card/50 backdrop-blur-xl px-4 py-3 z-20">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <textarea ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder="写下你的想法..." rows={1} disabled={store.isChatLoading}
            className="flex-1 min-h-[44px] max-h-[120px] px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-text-primary text-sm placeholder:text-black focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none resize-none transition-all disabled:opacity-50" />
          <button onClick={handleSend} disabled={!inputText.trim() || store.isChatLoading}
            className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${inputText.trim() && !store.isChatLoading ? "bg-accent text-[#E2E8F0] hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25" : "bg-background-elevated text-text-muted cursor-not-allowed"}`}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
