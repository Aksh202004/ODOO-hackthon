"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function AskQuestionPage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput.trim())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle question submission
    console.log("Submitting question:", { title, body, tags })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] dark:from-[#1A1A1A] dark:via-[#1A1A1A] dark:to-[#0F0F0F] transition-all duration-500">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Main Form */}
          <div className="flex-1">
            <div className="sleek-card rounded-2xl p-8 animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#212529] to-[#007BFF] dark:from-[#E9ECEF] dark:to-[#339DFF] bg-clip-text text-transparent mb-8">
                Ask a Question
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium text-[#212529] dark:text-[#E9ECEF]">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to center a div in CSS?"
                    className="mt-3 h-12 bg-white/50 dark:bg-[#1A1A1A]/50 border-white/20 dark:border-gray-600/50 focus:border-[#007BFF]/50 dark:focus:border-[#339DFF]/50 focus:ring-2 focus:ring-[#007BFF]/20 dark:focus:ring-[#339DFF]/20 rounded-xl backdrop-blur-sm transition-all duration-300 focus:bg-white dark:focus:bg-[#1A1A1A]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="body" className="text-base font-medium text-[#212529] dark:text-[#E9ECEF]">
                    Description
                  </Label>
                  <div className="mt-3">
                    <RichTextEditor
                      value={body}
                      onChange={setBody}
                      placeholder="Describe your problem in detail. Include code examples if relevant..."
                      minHeight="400px"
                    />
                  </div>
                  <p className="text-sm text-[#6C757D] dark:text-[#ADB5BD] mt-2">
                    Use the toolbar above for rich formatting or type Markdown syntax directly.
                  </p>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-base font-medium text-[#212529] dark:text-[#E9ECEF]">
                    Tags
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyPress}
                      placeholder="Add tags (press Enter or comma to add)"
                      className="bg-[#F8F9FA] dark:bg-[#1A1A1A] border-gray-300 dark:border-gray-600 focus:border-[#007BFF] dark:focus:border-[#339DFF] focus:ring-[#007BFF] dark:focus:ring-[#339DFF]"
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#007BFF] dark:bg-[#339DFF] text-white text-sm rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:bg-white/20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#6C757D] dark:text-[#ADB5BD] mt-2">
                    Add up to 5 tags to describe what your question is about.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="sleek-button bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#339DFF] dark:to-[#2b8cff] hover:from-[#0056b3] hover:to-[#004085] dark:hover:from-[#2b8cff] dark:hover:to-[#1a7cff] text-white h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                  >
                    Post Your Question
                  </Button>
                  <Button type="button" variant="outline">
                    Save Draft
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips Sidebar */}
          <div className="w-80">
            <div className="sleek-card rounded-2xl p-6 sticky top-28 animate-slide-up">
              <h3 className="font-semibold text-[#212529] dark:text-[#E9ECEF] mb-3">Writing Tips</h3>
              <div className="space-y-3 text-sm text-[#6C757D] dark:text-[#ADB5BD]">
                <div>
                  <h4 className="font-medium text-[#212529] dark:text-[#E9ECEF]">How to write a good title</h4>
                  <p>Be specific and describe the problem clearly</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#212529] dark:text-[#E9ECEF]">Use code blocks</h4>
                  <p>Wrap code in \`\`\` for better formatting</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#212529] dark:text-[#E9ECEF]">Add relevant tags</h4>
                  <p>Help others find and answer your question</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#212529] dark:text-[#E9ECEF]">Show your research</h4>
                  <p>Explain what you've tried and what didn't work</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
