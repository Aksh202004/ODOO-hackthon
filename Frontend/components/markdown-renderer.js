"use client"

export function MarkdownRenderer({ content }) {
  const renderMarkdown = (text) => {
    // Split by code blocks first to handle them separately
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g)

    return parts.map((part, index) => {
      // Handle code blocks
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).trim()
        const lines = code.split("\n")
        const language = lines[0].trim()
        const codeContent = lines.slice(language ? 1 : 0).join("\n")

        return (
          <div key={index} className="my-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-t-lg px-4 py-2 flex items-center justify-between">
              <span className="text-gray-300 text-sm font-mono">{language || "code"}</span>
              <button
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-b-lg overflow-x-auto border-l-4 border-blue-500">
              <code className="font-mono text-sm leading-relaxed">{codeContent}</code>
            </pre>
          </div>
        )
      }

      // Handle inline code
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1)
        return (
          <code
            key={index}
            className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-600"
          >
            {code}
          </code>
        )
      }

      // Handle regular markdown
      let processed = part

      // Bold
      processed = processed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Italic
      processed = processed.replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Strikethrough
      processed = processed.replace(/~~(.*?)~~/g, "<del>$1</del>")

      // Headers
      processed = processed.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      processed = processed.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      processed = processed.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')

      // Lists
      processed = processed.replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      processed = processed.replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')

      // Quotes
      processed = processed.replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-2">$1</blockquote>',
      )

      // Links
      processed = processed.replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )

      // Images
      processed = processed.replace(
        /!\[([^\]]*)\]$$([^)]+)$$/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />',
      )

      // Line breaks
      processed = processed.replace(/\n/g, "<br />")

      return <span key={index} dangerouslySetInnerHTML={{ __html: processed }} />
    })
  }

  return <div className="markdown-content">{renderMarkdown(content)}</div>
}
