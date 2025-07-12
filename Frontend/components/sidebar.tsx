"use client"

import { useState, useEffect } from "react"

interface Tag {
  _id: string;
  name: string;
  questionCount: number;
}

interface Question {
  _id: string;
  title: string;
}

export function Sidebar() {
  const [hotQuestions, setHotQuestions] = useState<Question[]>([])
  const [popularTags, setPopularTags] = useState<Tag[]>([])

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tags/popular');
        const data = await res.json();
        if (data.success) {
          setPopularTags(data.tags);
        }
      } catch (error) {
        console.error("Failed to fetch popular tags", error);
      }
    };

    const fetchHotQuestions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/questions/hot');
        const data = await res.json();
        if (data.success) {
          setHotQuestions(data.questions);
        }
      } catch (error) {
        console.error("Failed to fetch hot questions", error);
      }
    };

    fetchPopularTags();
    fetchHotQuestions();
  }, []);

  return (
    <aside className="w-80 space-y-8">
      {/* Hot Questions */}
      <div className="sleek-card rounded-2xl p-6 animate-slide-up">
        <h3 className="font-bold text-lg text-[#212529] dark:text-[#E9ECEF] mb-4 bg-gradient-to-r from-[#007BFF] to-[#339DFF] bg-clip-text text-transparent">
          Hot Questions
        </h3>
        <div className="space-y-3">
          {hotQuestions.map((question) => (
            <a
              key={question._id}
              href={`/questions/${question._id}`}
              className="block text-sm text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#007BFF] dark:hover:text-[#339DFF] transition-colors duration-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 leading-relaxed"
            >
              {question.title}
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
            <a
              key={tag._id}
              href={`/tags/${tag.name}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300 group cursor-pointer"
            >
              <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-[#212529] dark:text-[#E9ECEF] text-sm rounded-lg border border-gray-200/50 dark:border-gray-600/50 group-hover:from-[#007BFF]/10 group-hover:to-[#339DFF]/10 transition-all duration-300">
                {tag.name}
              </span>
              <span className="text-sm text-[#6C757D] dark:text-[#ADB5BD] font-medium">{tag.questionCount}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
