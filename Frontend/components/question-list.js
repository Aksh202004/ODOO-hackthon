"use client"

import { useEffect, useState } from "react"
import { QuestionCard } from "@/components/question-card"

export function QuestionList() {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/questions")
        const data = await response.json()
        setQuestions(data.questions || [])
      } catch (error) {
        console.error("Error fetching questions:", error)
      }
    }

    fetchQuestions()
  }, [])

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6C757D] dark:text-[#ADB5BD] mb-4">No questions yet. Be the first to ask!</p>
        <button className="bg-[#007BFF] dark:bg-[#339DFF] text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity">
          Ask Question
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard key={question._id} question={question} />
      ))}
    </div>
  )
}
