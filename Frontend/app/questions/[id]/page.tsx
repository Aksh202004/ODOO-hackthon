"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { VoteComponent } from "@/components/vote-component"
import { Check } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { AnswerForm } from "@/components/answer-form"

// Define interfaces for our data structures
interface User {
  _id: string;
  username: string;
  avatar?: string;
}

interface Tag {
  _id: string;
  name: string;
}

interface Vote {
  user: string;
}

interface Answer {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  isAccepted: boolean;
  votes: {
    upvotes: Vote[];
    downvotes: Vote[];
  };
}

interface Question {
  _id: string;
  title: string;
  description: string;
  author: User;
  tags: Tag[];
  answers: Answer[];
  createdAt: string;
  votes: {
    upvotes: Vote[];
    downvotes: Vote[];
  };
}

export default function QuestionDetailPage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const { id } = params

  const handleAnswerSubmit = (newAnswer: Answer) => {
    setQuestion((prevQuestion) => {
      if (!prevQuestion) return null
      return {
        ...prevQuestion,
        answers: [...prevQuestion.answers, newAnswer],
      }
    })
  }

  useEffect(() => {
    if (id) {
      const fetchQuestion = async () => {
        try {
          setLoading(true)
          const response = await fetch(`http://localhost:5000/api/questions/${id}`)
          const data = await response.json()
          if (!data.success) {
            throw new Error(data.message || "Failed to fetch question")
          }
          setQuestion(data.question)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchQuestion()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg" role="alert">
          Question not found.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] dark:from-[#1A1A1A] dark:via-[#1A1A1A] dark:to-[#0F0F0F] transition-all duration-500">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Question Section */}
        <div className="sleek-card rounded-2xl p-8 mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#212529] to-[#007BFF] dark:from-[#E9ECEF] dark:to-[#339DFF] bg-clip-text text-transparent mb-6 leading-tight">
            {question.title}
          </h1>

          <div className="flex gap-6">
            <VoteComponent initialScore={question.votes.upvotes.length - question.votes.downvotes.length} />

            <div className="flex-1">
              <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
                <MarkdownRenderer content={question.description} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag: Tag) => (
                    <span
                      key={tag._id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-[#212529] dark:text-[#E9ECEF] text-sm rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={question.author.avatar || "/placeholder.svg"}
                    alt={question.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-right">
                    <div className="text-sm text-[#007BFF] dark:text-[#339DFF]">{question.author.username}</div>
                    <div className="text-xs text-[#6C757D] dark:text-[#ADB5BD]">asked {new Date(question.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#212529] to-[#007BFF] dark:from-[#E9ECEF] dark:to-[#339DFF] bg-clip-text text-transparent mb-6">
            {question.answers.length} Answers
          </h2>

          <div className="space-y-4">
            {question.answers.map((answer: Answer) => (
              <div
                key={answer._id}
                className={`sleek-card rounded-2xl p-8 hover-lift animate-slide-up ${
                  answer.isAccepted
                    ? "border-l-4 border-l-[#28A745] bg-gradient-to-r from-green-50/30 to-transparent dark:from-green-900/10 dark:to-transparent"
                    : ""
                }`}
              >
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <VoteComponent initialScore={answer.votes.upvotes.length - answer.votes.downvotes.length} />
                    {answer.isAccepted && (
                      <div className="mt-4 p-2 bg-[#28A745] rounded-full">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
                      <MarkdownRenderer content={answer.content} />
                    </div>

                    <div className="flex justify-end">
                      <div className="flex items-center gap-2">
                        <img
                          src={answer.author.avatar || "/placeholder.svg"}
                          alt={answer.author.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="text-right">
                          <div className="text-sm text-[#007BFF] dark:text-[#339DFF]">{answer.author.username}</div>
                          <div className="text-xs text-[#6C757D] dark:text-[#ADB5BD]">answered {new Date(answer.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Form */}
        <AnswerForm questionId={question._id} onAnswerSubmit={handleAnswerSubmit} />
      </div>
    </div>
  )
}
