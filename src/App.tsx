import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import DimensionalGridTunnel from "@/components/effects/DimensionalGridTunnel"
import WelcomeScreen from "@/screens/WelcomeScreen"
import ChatScreen from "@/screens/ChatScreen"
import ResultScreen from "@/screens/ResultScreen"
import StoryScreen from "@/screens/StoryScreen"
import ReportScreen from "@/screens/ReportScreen"
import "./App.css"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const pageTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const showTunnel = location.pathname === "/" || location.pathname === "/welcome"

  return (
    <div className="relative min-h-screen" style={{ background: "#06060D" }}>
      {showTunnel && <DimensionalGridTunnel />}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><WelcomeScreen /></PageWrapper>} />
            <Route path="/welcome" element={<PageWrapper><WelcomeScreen /></PageWrapper>} />
            <Route path="/chat" element={<PageWrapper><ChatScreen /></PageWrapper>} />
            <Route path="/result" element={<PageWrapper><ResultScreen /></PageWrapper>} />
            <Route path="/story" element={<PageWrapper><StoryScreen /></PageWrapper>} />
            <Route path="/report" element={<PageWrapper><ReportScreen /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}
