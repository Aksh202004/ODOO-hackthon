import { Navbar } from "@/components/navbar"
import { QuestionList } from "@/components/question-list"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] dark:from-[#1A1A1A] dark:via-[#1A1A1A] dark:to-[#0F0F0F] transition-all duration-500">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#212529] to-[#007BFF] dark:from-[#E9ECEF] dark:to-[#339DFF] bg-clip-text text-transparent">
                All Questions
              </h1>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 text-sm bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#339DFF] dark:to-[#2b8cff] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium">
                  Newest
                </button>
                <button className="px-4 py-2.5 text-sm text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] hover:bg-white dark:hover:bg-[#2A2A2A] rounded-xl transition-all duration-300 font-medium border border-gray-200/50 dark:border-gray-700/50">
                  Most Votes
                </button>
                <button className="px-4 py-2.5 text-sm text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] hover:bg-white dark:hover:bg-[#2A2A2A] rounded-xl transition-all duration-300 font-medium border border-gray-200/50 dark:border-gray-700/50">
                  Unanswered
                </button>
              </div>
            </div>
            <QuestionList />
            <div className="flex justify-center items-center space-x-3 mt-12">
              <button className="px-4 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] rounded-lg hover:bg-white dark:hover:bg-[#2A2A2A] transition-all duration-300 font-medium">
                Previous
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#339DFF] dark:to-[#2b8cff] text-white rounded-lg shadow-lg font-medium">
                1
              </button>
              <button className="px-4 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] rounded-lg hover:bg-white dark:hover:bg-[#2A2A2A] transition-all duration-300 font-medium">
                2
              </button>
              <button className="px-4 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] rounded-lg hover:bg-white dark:hover:bg-[#2A2A2A] transition-all duration-300 font-medium">
                3
              </button>
              <button className="px-4 py-2 text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] rounded-lg hover:bg-white dark:hover:bg-[#2A2A2A] transition-all duration-300 font-medium">
                Next
              </button>
            </div>
          </main>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
