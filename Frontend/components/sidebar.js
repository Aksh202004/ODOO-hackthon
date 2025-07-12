export function Sidebar() {
  const hotQuestions = [
    "How to optimize React performance?",
    "Best practices for TypeScript?",
    "CSS Grid vs Flexbox when to use?",
    "Next.js vs React - key differences?",
  ]

  const popularTags = [
    { name: "javascript", count: 1234 },
    { name: "react", count: 987 },
    { name: "css", count: 756 },
    { name: "html", count: 654 },
    { name: "nextjs", count: 543 },
    { name: "typescript", count: 432 },
  ]

  return (
    <aside className="w-80 space-y-8">
      {/* Hot Questions */}
      <div className="sleek-card rounded-2xl p-6 animate-slide-up">
        <h3 className="font-bold text-lg text-[#212529] dark:text-[#E9ECEF] mb-4 bg-gradient-to-r from-[#007BFF] to-[#339DFF] bg-clip-text text-transparent">
          Hot Questions
        </h3>
        <div className="space-y-3">
          {hotQuestions.map((question, index) => (
            <a
              key={index}
              href="#"
              className="block text-sm text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] transition-colors duration-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 leading-relaxed"
            >
              {question}
            </a>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="sleek-card rounded-2xl p-6 animate-slide-up">
        <h3 className="font-bold text-lg text-[#212529] dark:text-[#E9ECEF] mb-4 bg-gradient-to-r from-[#007BFF] to-[#339DFF] bg-clip-text text-transparent">
          Popular Tags
        </h3>
        <div className="space-y-3">
          {popularTags.map((tag) => (
            <div
              key={tag.name}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300 group cursor-pointer"
            >
              <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-[#212529] dark:text-[#E9ECEF] text-sm rounded-lg border border-gray-200/50 dark:border-gray-600/50 group-hover:from-[#007BFF]/10 group-hover:to-[#339DFF]/10 transition-all duration-300">
                {tag.name}
              </span>
              <span className="text-sm text-[#6C757D] dark:text-[#ADB5BD] font-medium">{tag.count}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
