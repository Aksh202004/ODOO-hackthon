import { QuestionCard } from "@/components/question-card"

const mockQuestions = [
  {
    id: 1,
    title: "How to center a div in CSS?",
    excerpt:
      "I've been trying to center a div both horizontally and vertically but can't seem to get it right. I've tried using flexbox but it's not working as expected...",
    votes: 15,
    answers: 8,
    views: 234,
    tags: ["css", "html", "flexbox"],
    author: {
      name: "john_doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "5 mins ago",
    hasAcceptedAnswer: true,
  },
  {
    id: 2,
    title: "React useState not updating immediately",
    excerpt:
      "I'm having trouble with useState in React. When I call the setter function, the state doesn't seem to update immediately. Is this normal behavior?",
    votes: 23,
    answers: 12,
    views: 456,
    tags: ["react", "javascript", "hooks"],
    author: {
      name: "react_dev",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "2 hours ago",
    hasAcceptedAnswer: false,
  },
  {
    id: 3,
    title: "Best practices for API error handling in Next.js",
    excerpt:
      "What are the recommended patterns for handling API errors in Next.js applications? Should I use try-catch blocks or error boundaries?",
    votes: 7,
    answers: 3,
    views: 89,
    tags: ["nextjs", "api", "error-handling"],
    author: {
      name: "nextjs_fan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "1 day ago",
    hasAcceptedAnswer: false,
  },
]

export function QuestionList() {
  if (mockQuestions.length === 0) {
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
      {mockQuestions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button className="px-3 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF]">
          Previous
        </button>
        <button className="px-3 py-2 bg-[#007BFF] dark:bg-[#339DFF] text-white rounded">1</button>
        <button className="px-3 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF]">
          2
        </button>
        <button className="px-3 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF]">
          3
        </button>
        <button className="px-3 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF]">
          Next
        </button>
      </div>
    </div>
  )
}
