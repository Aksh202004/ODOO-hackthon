"use client"

import { useState, useRef } from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Smile,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "💯", "🎉", "🚀", "💡", "⚡", "✨", "🎯", "🏆"]

export function RichTextEditor({ value, onChange, placeholder, minHeight = "300px" }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)
    setTimeout(() => {
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, end + before.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
      textarea.focus()
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const newText = value.substring(0, start) + text + value.substring(start)
    onChange(newText)
    setTimeout(() => {
      textarea.setSelectionRange(start + text.length, start + text.length)
      textarea.focus()
    }, 0)
  }

  const insertLink = () => {
    if (linkUrl) {
      const linkMarkdown = `[${linkText || linkUrl}](${linkUrl})`
      insertAtCursor(linkMarkdown)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      const imageMarkdown = `![${imageAlt || "Image"}](${imageUrl})`
      insertAtCursor(imageMarkdown)
      setImageUrl("")
      setImageAlt("")
    }
  }

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertText("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertText("*", "*") },
    { icon: Strikethrough, label: "Strikethrough", action: () => insertText("~~", "~~") },
    { icon: Heading1, label: "Heading 1", action: () => insertText("\n# ", "") },
    { icon: Heading2, label: "Heading 2", action: () => insertText("\n## ", "") },
    { icon: Heading3, label: "Heading 3", action: () => insertText("\n### ", "") },
    { icon: List, label: "Bullet List", action: () => insertText("\n- ", "") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertText("\n1. ", "") },
    { icon: Code, label: "Code Block", action: () => insertText("\n```\n", "\n```") },
    { icon: Quote, label: "Quote", action: () => insertText("\n> ", "") },
  ]

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A]">
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={button.action}
              className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              title={button.label}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                title="Insert Emoji"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertAtCursor(emoji)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="link-text">Link Text</Label>
                  <Input id="link-text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Link text (optional)" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="link-url">URL</Label>
                  <Input id="link-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="mt-1" />
                </div>
                <Button onClick={insertLink} type="button" className="w-full">
                  Insert Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input id="image-alt" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Image description" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="mt-1" />
                </div>
                <Button onClick={insertImage} type="button" className="w-full">
                  Insert Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 focus:ring-0 resize-none font-mono text-sm leading-relaxed"
        style={{ minHeight }}
      />
      {value && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownRenderer content={value} />
          </div>
        </div>
      )}
    </div>
  )
}