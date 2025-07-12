"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Notification {
  _id: string;
  sender: {
    avatar: string;
    username: string;
  };
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token')
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token')
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/notifications/mark-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
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
              key={notification._id}
              className={`p-4 border-b border-gray-100/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 cursor-pointer transition-all duration-300 ${
                !notification.isRead
                  ? "bg-gradient-to-r from-blue-50/50 to-blue-25/50 dark:from-blue-900/10 dark:to-blue-800/10 border-l-4 border-l-[#007BFF] dark:border-l-[#339DFF]"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={notification.sender.avatar || "/placeholder.svg"}
                  alt={notification.sender.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#212529] dark:text-[#E9ECEF]">
                    <span className="font-medium">{notification.sender.username}</span>
                    {` ${notification.message}`}
                  </p>
                  <p className="text-xs text-[#6C757D] dark:text-[#ADB5BD] mt-1">{formatDistanceToNow(new Date(notification.createdAt))} ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
