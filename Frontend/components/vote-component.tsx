"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface VoteComponentProps {
  initialScore: number
  initialVote?: "up" | "down" | null
  onVote?: (vote: "up" | "down" | null) => void
}

export function VoteComponent({ initialScore, initialVote = null, onVote }: VoteComponentProps) {
  const [score, setScore] = useState(initialScore)
  const [vote, setVote] = useState<"up" | "down" | null>(initialVote)

  const handleVote = (newVote: "up" | "down") => {
    let newScore = score
    let finalVote: "up" | "down" | null = newVote

    // Calculate score change
    if (vote === null) {
      newScore += newVote === "up" ? 1 : -1
    } else if (vote !== newVote) {
      newScore += newVote === "up" ? 2 : -2
    } else {
      // Clicking the same vote removes it
      newScore += vote === "up" ? -1 : 1
      finalVote = null
    }

    // Optimistic update
    setScore(newScore)
    setVote(finalVote)
    onVote?.(finalVote)
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={() => handleVote("up")}
        className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
          vote === "up"
            ? "text-[#28A745] bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 shadow-lg border-2 border-green-200 dark:border-green-700"
            : "text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#28A745] hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 dark:hover:from-green-900/20 dark:hover:to-green-800/20 border-2 border-transparent hover:border-green-200 dark:hover:border-green-700"
        }`}
      >
        <ChevronUp className="w-7 h-7" />
      </button>

      <span className="text-2xl font-bold text-[#212529] dark:text-[#E9ECEF] px-2 py-1 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 min-w-[60px] text-center">
        {score}
      </span>

      <button
        onClick={() => handleVote("down")}
        className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
          vote === "down"
            ? "text-[#DC3545] bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 shadow-lg border-2 border-red-200 dark:border-red-700"
            : "text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#DC3545] hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 border-2 border-transparent hover:border-red-200 dark:hover:border-red-700"
        }`}
      >
        <ChevronDown className="w-7 h-7" />
      </button>
    </div>
  )
}
