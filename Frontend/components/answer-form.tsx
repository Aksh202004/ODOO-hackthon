"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/rich-text-editor"

export function AnswerForm({ questionId, onAnswerSubmit }: { questionId: string, onAnswerSubmit: (answer: any) => void }) {
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You must be logged in to post an answer.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: answer,
          questionId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to submit answer")
      }

      onAnswerSubmit(data.answer)
      setAnswer("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="sleek-card rounded-2xl p-8 animate-fade-in">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#212529] to-[#007BFF] dark:from-[#E9ECEF] dark:to-[#339DFF] bg-clip-text text-transparent mb-6">
        Your Answer
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RichTextEditor
          value={answer}
          onChange={setAnswer}
          placeholder="Write your answer here... You can use the toolbar above for formatting."
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-[#6C757D] dark:text-[#ADB5BD]">
            Use the toolbar for rich formatting or type Markdown syntax directly.
          </div>

          <Button
            type="submit"
            disabled={!answer.trim() || isSubmitting}
            className="sleek-button bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#339DFF] dark:to-[#2b8cff] hover:from-[#0056b3] hover:to-[#004085] dark:hover:from-[#2b8cff] dark:hover:to-[#1a7cff] text-white h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            {isSubmitting ? "Submitting..." : "Post Your Answer"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  )
}
