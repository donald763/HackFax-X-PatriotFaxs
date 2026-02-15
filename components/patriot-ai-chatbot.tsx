"use client"

import { useState, useRef } from "react"

interface PatriotAIChatbotProps {
  variant?: "modal" | "sidebar"
}

export function PatriotAIChatbot({ variant = "modal" }: PatriotAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const chatButtonRef = useRef<HTMLButtonElement>(null)

  // Modal variant
  if (variant === "modal") {
    return (
      <>
        {/* Floating Chat Button */}
        <button
          ref={chatButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 hover:from-green-700 hover:to-green-800"
          aria-label="Toggle PatriotAI Chat"
          title="Ask PatriotAI for help"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H8l-2 2v-2H4V4h16v10z" />
          </svg>
        </button>

        {/* Chat Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col h-[600px] w-full max-w-md sm:max-w-lg md:max-w-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">PatriotAI Assistant</h2>
                  <p className="text-sm text-green-100">Ask for help anytime</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-green-100 transition-colors"
                  aria-label="Close chat"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Chat Content - iFrame */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src="https://patriotai.gmu.edu/chat/onechat"
                  className="w-full h-full border-none"
                  title="PatriotAI Chat"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage"
                />
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 text-xs text-gray-600">
                <p>Powered by PatriotAI - George Mason University</p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Sidebar variant
  if (!sidebarOpen) {
    return (
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-12 h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all hover:shadow-xl"
        aria-label="Open PatriotAI Sidebar"
        title="Open PatriotAI"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H8l-2 2v-2H4V4h16v10z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed right-0 top-0 h-screen max-h-screen w-80 border-l border-gray-200 bg-white flex flex-col flex-shrink-0 shadow-lg z-50" style={{ height: '100dvh', maxHeight: '100dvh' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex-1">
          <h2 className="text-base font-bold">PatriotAI</h2>
          <p className="text-xs text-green-100">Study Assistant</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-white hover:text-green-100 transition-colors flex-shrink-0 ml-2"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Chat Content - iFrame */}
      <div className="flex-1 overflow-hidden bg-white">
        <iframe
          src="https://patriotai.gmu.edu/chat/onechat"
          className="w-full h-full border-none"
          title="PatriotAI Chat"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage"
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-600 flex-shrink-0">
        <p>George Mason University</p>
      </div>
    </div>
  )
}
