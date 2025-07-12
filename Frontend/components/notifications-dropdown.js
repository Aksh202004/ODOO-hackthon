"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockNotifications = [
  {
    id: 1,
    type: "answer",
    user: "jane_smith",
    avatar: "/placeholder.svg?height=32&width=32",
    question: "How to center a div in CSS?",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    type: "vote",
    user: "dev_master",
    avatar: "/placeholder.svg?height=32&width=32",
    question: "React useState not updating immediately",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "comment",
    user: "code_ninja",
    avatar: "/placeholder.svg?height=32&width=32",
    question: "Best practices for API error handling",
    time: "3 hours ago",
    read: true,
  },
]

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
        >
          <Bell className="w-5 h-5 text-[#6C757D] dark:text-[#ADB5BD]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#DC3545] to-[#c82333] text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 sleek-card rounded-2xl border-0 shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg bg-gradient-to-r from-[#212529] to-[#007BFF] dark:from-[#E9ECEF] dark:to-[#339DFF] bg-clip-text text-transparent">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#007BFF] dark:text-[#339DFF] hover:underline font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 cursor-pointer transition-all duration-300 ${
                !notification.read
                  ? "bg-gradient-to-r from-blue-50/50 to-blue-25/50 dark:from-blue-900/10 dark:to-blue-800/10 border-l-4 border-l-[#007BFF] dark:border-l-[#339DFF]"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={notification.avatar || "/placeholder.svg"}
                  alt={notification.user}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#212529] dark:text-[#E9ECEF]">
                    <span className="font-medium">{notification.user}</span>
                    {notification.type === "answer" && " answered your question "}
                    {notification.type === "vote" && " voted on your question "}
                    {notification.type === "comment" && " commented on "}
                    <span className="text-[#007BFF] dark:text-[#339DFF]">"{notification.question}"</span>
                  </p>
                  <p className="text-xs text-[#6C757D] dark:text-[#ADB5BD] mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
