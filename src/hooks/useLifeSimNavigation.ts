import { useNavigate } from "react-router-dom"
import { useLifeSimStore } from "@/store/useLifeSimStore"
import type { Screen } from "@/types"

const screenPaths: Record<Screen, string> = {
  welcome: "/",
  chat: "/chat",
  result: "/result",
  story: "/story",
  report: "/report",
}

export function useLifeSimNavigation() {
  const navigate = useNavigate()
  const store = useLifeSimStore()

  const goTo = (screen: Screen) => {
    store.switchScreen(screen)
    navigate(screenPaths[screen])
  }

  const startStory = (branchId: number) => {
    store.startStory(branchId)
    navigate("/story")
  }

  const restart = () => {
    store.resetSession()
    navigate("/")
  }

  return { goTo, startStory, restart }
}
