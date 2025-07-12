"use client"

import Link from "next/link"
import { Check, ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"

export function QuestionCard({ question }) {
  const [votes, setVotes] = useState(question.voteCount)
  const [userVote, setUserVote] = useState(null)

  const handleVote = (voteType) => {
    let newVotes = votes
    let newUserVote = voteType

    // Calculate vote change
    if (userVote === null) {
      newVotes += voteType === "up" ? 1 : -1
    } else if (userVote !== voteType) {
      newVotes += voteType === "up" ? 2 : -2
    } else {
      // Clicking same vote removes it
      newVotes += userVote === "up" ? -1 : 1
      newUserVote = null
    }

    setVotes(newVotes)
    setUserVote(newUserVote)
  }

  return (
    <div className="sleek-card rounded-2xl p-6 hover-lift animate-fade-in group">
      {/* Main Content */}
      <div className="mb-4">
        <Link href={`/questions/${question._id}`}>
          <h3 className="text-xl font-bold text-[#212529] dark:text-[#E9ECEF] group-hover:text-[#007BFF] dark:group-hover:text-[#339DFF] transition-all duration-300 mb-3 leading-tight">
            {question.title}
          </h3>
        </Link>
        <p className="text-[#6C757D] dark:text-[#ADB5BD] mb-4 line-clamp-2 leading-relaxed">{question.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag) => (
            <span
              key={tag._id}
              className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-[#212529] dark:text-[#E9ECEF] text-sm rounded-lg border border-gray-200/50 dark:border-gray-600/50 hover:from-[#007BFF]/10 hover:to-[#339DFF]/10 dark:hover:from-[#339DFF]/10 dark:hover:to-[#007BFF]/10 transition-all duration-300 cursor-pointer"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Section with Stats and Voting */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        {/* Left: Author and Time */}
        <div className="flex items-center gap-3">
          <img
            src={question.author.avatar || "/placeholder.svg"}
            alt={question.author.username}
            className="w-7 h-7 rounded-lg border border-white dark:border-gray-700 shadow-sm"
          />
          <div>
            <span className="text-sm font-medium text-[#007BFF] dark:text-[#339DFF] hover:underline cursor-pointer">
              {question.author.username}
            </span>
            <div className="text-xs text-[#6C757D] dark:text-[#ADB5BD]">asked {question.createdAt}</div>
          </div>
        </div>

        {/* Right: Stats and Voting */}
        <div className="flex items-center gap-6">
          {/* Votes with voting buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote("up")}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                userVote === "up"
                  ? "text-[#28A745] bg-green-50 dark:bg-green-900/20"
                  : "text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#28A745] hover:bg-green-50 dark:hover:bg-green-900/20"
              }`}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-[#212529] dark:text-[#E9ECEF] min-w-[30px] text-center">
              {votes}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                userVote === "down"
                  ? "text-[#DC3545] bg-red-50 dark:bg-red-900/20"
                  : "text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#DC3545] hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#6C757D] dark:text-[#ADB5BD] ml-1">votes</span>
          </div>

          {/* Answers */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#212529] dark:text-[#E9ECEF]">{question.answers.length}</span>
            <span className="text-xs text-[#6C757D] dark:text-[#ADB5BD]">answers</span>
            {question.hasAcceptedAnswer && <Check className="w-4 h-4 text-[#28A745]" />}
          </div>

          {/* Views */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#212529] dark:text-[#E9ECEF]">{question.views}</span>
            <span className="text-xs text-[#6C757D] dark:text-[#ADB5BD]">views</span>
          </div>
        </div>
      </div>
    </div>
  )
}
