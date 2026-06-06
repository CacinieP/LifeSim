export type Screen = "welcome" | "chat" | "result" | "story" | "report"

export type Provider = "deepseek" | "openai" | "moonshot" | "zhipu" | "wanjie" | "stepfun" | "custom"

export type ImageProvider = "none" | "stepfun"

export type DecisionType = "gaokao" | "graduate" | "job" | "career" | "city" | "other"

export interface ApiConfig {
  provider: Provider
  apiKey: string
  modelName: string
  customEndpoint: string
  imageProvider: ImageProvider
  imageModelName: string
  imageApiKey: string
}

export interface DecisionContext {
  decisionType: DecisionType
  decisionOptions: string
  decisionPriority: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface Choice {
  text: string
  personality: string
  strategy: string
}

export interface Stage {
  stage: string
  period: string
  scene: string
  actionItems: string[]
  milestone: string
  choices: Choice[]
  imageUrl?: string
}

export interface Branch {
  id: number
  name: string
  icon: string
  shortDesc: string
  stages: Stage[]
  bestCase: string
  worstCase: string
  mostLikely: string
  pros: string[]
  cons: string[]
  scores: {
    difficulty: number
    satisfaction: number
    risk: number
    growth: number
  }
}

export interface Recommendation {
  primaryId: number
  reasoning: string
  tips: string[]
  actionChecklist: string[]
  pitfalls: string[]
}

export interface ScenarioData {
  userSummary: string
  researchSummary: string
  branches: Branch[]
  recommendation: Recommendation
  disclaimer: string
}

export interface StoryHistoryEntry {
  branchId: number
  stageIndex: number
  choiceText: string
  choiceIndex: number
  personality: string
  strategy: string
  stage: string
  period: string
}

export interface StoryState {
  currentBranchId: number | null
  currentStageIndex: number
  history: StoryHistoryEntry[]
  completedBranches: number[]
  isTyping: boolean
}

export interface LifeSimStore {
  apiConfig: ApiConfig
  decisionContext: DecisionContext
  profileFileName: string
  profileFileContent: string
  chatHistory: ChatMessage[]
  isChatLoading: boolean
  showSimulateButton: boolean
  scenarioData: ScenarioData | null
  isSimulating: boolean
  story: StoryState
  currentScreen: Screen
  setApiConfig: (config: Partial<ApiConfig>) => void
  setDecisionContext: (context: Partial<DecisionContext>) => void
  setProfileFile: (name: string, content: string) => void
  appendChatMessage: (message: ChatMessage) => void
  setChatLoading: (loading: boolean) => void
  setShowSimulateButton: (show: boolean) => void
  clearChat: () => void
  setScenarioData: (data: ScenarioData | null) => void
  setSimulating: (simulating: boolean) => void
  startStory: (branchId: number) => void
  makeChoice: (choiceIndex: number) => void
  skipTyping: () => void
  setTyping: (typing: boolean) => void
  completeBranch: (branchId: number) => void
  switchScreen: (screen: Screen) => void
  reset: () => void
}
