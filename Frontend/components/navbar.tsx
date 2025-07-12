"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, Moon, Sun, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { useTheme } from "next-themes"

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-white/10 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#339DFF] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#212529] to-[#007BFF] dark:from-[#E9ECEF] dark:to-[#339DFF] bg-clip-text text-transparent">
                StackIt
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] dark:text-[#ADB5BD] w-5 h-5 group-focus-within:text-[#007BFF] dark:group-focus-within:text-[#339DFF] transition-colors" />
              <Input
                placeholder="Search questions..."
                className="pl-12 h-12 bg-white/50 dark:bg-[#1A1A1A]/50 border-white/20 dark:border-gray-600/50 focus:border-[#007BFF]/50 dark:focus:border-[#339DFF]/50 focus:ring-2 focus:ring-[#007BFF]/20 dark:focus:ring-[#339DFF]/20 rounded-xl backdrop-blur-sm transition-all duration-300 focus:bg-white dark:focus:bg-[#1A1A1A] shadow-sm"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-[#6C757D] dark:text-[#ADB5BD] hover:text-[#212529] dark:hover:text-[#E9ECEF]"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isLoggedIn ? (
              <>
                {/* Ask Question Button */}
                <Link href="/ask">
                  <Button className="sleek-button bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#339DFF] dark:to-[#2b8cff] hover:from-[#0056b3] hover:to-[#004085] dark:hover:from-[#2b8cff] dark:hover:to-[#1a7cff] text-white h-11 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Ask Question
                  </Button>
                </Link>

                {/* Notifications */}
                <NotificationsDropdown />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-[#007BFF] to-[#339DFF] rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>My Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button>
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
