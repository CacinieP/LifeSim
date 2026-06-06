"use client"

import { create } from "zustand"
import type { LifeSimStore, ApiConfig, DecisionContext, DecisionType, Screen, ChatMessage, ScenarioData, StoryHistoryEntry } from "@/types"

const defaultApiConfig: ApiConfig = {
  provider: "stepfun",
  apiKey: "",
  modelName: "step-3.7-flash",
  customEndpoint: "https://api.stepfun.com/v1",
  imageProvider: "stepfun",
  imageModelName: "step-image-edit-2",
  imageApiKey: "",
}

const defaultDecisionContext: DecisionContext = {
  decisionType: "" as DecisionType,
  decisionOptions: "",
  decisionPriority: "",
}

const initialState = {
  apiConfig: defaultApiConfig,
  decisionContext: defaultDecisionContext,
  profileFileName: "",
  profileFileContent: "",
  chatHistory: [] as ChatMessage[],
  isChatLoading: false,
  showSimulateButton: false,
  scenarioData: null as ScenarioData | null,
  isSimulating: false,
  story: {
    currentBranchId: null as number | null,
    currentStageIndex: 0,
    history: [] as StoryHistoryEntry[],
    completedBranches: [] as number[],
    isTyping: false,
  },
  currentScreen: "welcome" as Screen,
}

export const useLifeSimStore = create<LifeSimStore>((set) => ({
  ...initialState,

  setApiConfig: (config) => set((state) => ({ apiConfig: { ...state.apiConfig, ...config } })),

  setDecisionContext: (context) => set((state) => ({ decisionContext: { ...state.decisionContext, ...context } })),

  setProfileFile: (name, content) => set({ profileFileName: name, profileFileContent: content }),

  appendChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),

  setChatLoading: (loading) => set({ isChatLoading: loading }),

  setShowSimulateButton: (show) => set({ showSimulateButton: show }),

  clearChat: () => set({ chatHistory: [], showSimulateButton: false }),

  setScenarioData: (data) => set({ scenarioData: data }),

  setSimulating: (simulating) => set({ isSimulating: simulating }),

  startStory: (branchId) =>
    set((state) => ({
      story: { ...state.story, currentBranchId: branchId, currentStageIndex: 0, isTyping: true },
      currentScreen: "story" as Screen,
    })),

  makeChoice: (choiceIndex) =>
    set((state) => {
      const { story, scenarioData } = state
      if (!scenarioData || story.currentBranchId === null) return state
      const branch = scenarioData.branches.find((b) => b.id === story.currentBranchId)
      if (!branch) return state
      const currentStage = branch.stages[story.currentStageIndex]
      if (!currentStage) return state
      const choice = currentStage.choices[choiceIndex]
      if (!choice) return state

      const newEntry: StoryHistoryEntry = {
        branchId: story.currentBranchId,
        stageIndex: story.currentStageIndex,
        choiceText: choice.text,
        choiceIndex,
        personality: choice.personality,
        strategy: choice.strategy,
        stage: currentStage.stage,
        period: currentStage.period,
      }

      const nextStageIndex = story.currentStageIndex + 1
      const isComplete = nextStageIndex >= branch.stages.length

      return {
        story: {
          ...story,
          currentStageIndex: isComplete ? story.currentStageIndex : nextStageIndex,
          history: [...story.history, newEntry],
          completedBranches: isComplete ? [...story.completedBranches, story.currentBranchId] : story.completedBranches,
          isTyping: !isComplete,
        },
      }
    }),

  skipTyping: () => set((state) => ({ story: { ...state.story, isTyping: false } })),

  setTyping: (typing) => set((state) => ({ story: { ...state.story, isTyping: typing } })),

  completeBranch: (branchId) =>
    set((state) => ({
      story: { ...state.story, completedBranches: [...state.story.completedBranches, branchId] },
    })),

  switchScreen: (screen) => set({ currentScreen: screen }),

  reset: () => set(initialState),

  resetSession: () =>
    set((state) => ({
      chatHistory: [],
      isChatLoading: false,
      showSimulateButton: false,
      scenarioData: null,
      isSimulating: false,
      story: { ...initialState.story },
      currentScreen: "welcome" as Screen,
      apiConfig: state.apiConfig,
      decisionContext: state.decisionContext,
      profileFileName: state.profileFileName,
      profileFileContent: state.profileFileContent,
    })),
}))
