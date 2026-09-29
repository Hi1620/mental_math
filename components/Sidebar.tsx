'use client'

import {
  Brain,
  Club,
  Gamepad2,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface NavItem {
  icon: React.ReactNode
  label: string
  href?: string
}

const topItems: NavItem[] = [
  { icon: <Gamepad2 size={20} />, label: 'Arena', href: '/' },
  { icon: <Target size={20} />, label: 'Quests', href: '/quests' },
  { icon: <Trophy size={20} />, label: 'Compete', href: '/compete' },
  { icon: <MessageSquare size={20} />, label: 'Feed', href: '/feed' },
  { icon: <Users size={20} />, label: 'Group Play', href: '/group-play' },
]

const bottomItems: NavItem[] = [
  { icon: <Club size={20} />, label: 'Clubs', href: '/clubs' },
  { icon: <Sparkles size={20} />, label: 'Kids Zone', href: '/kids-zone' },
  { icon: <Brain size={20} />, label: 'AI Coach', href: '/ai-coach' },
  { icon: <MoreHorizontal size={20} />, label: 'More', href: '/more' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [showFeedPrompt, setShowFeedPrompt] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const NavItemComponent = ({
    item,
  }: {
    item: NavItem
  }) => {
    const isActive = item.href === pathname

    const content = (
      <>
        <span
          className={
            isActive
              ? 'text-black'
              : 'text-gray-400 group-hover:text-neon'
          }
        >
          {item.icon}
        </span>

        <span className="hidden lg:inline text-[13px] font-medium tracking-wide">
          {item.label}
        </span>

        {isActive && (
          <div className="hidden lg:block absolute right-2 w-1 h-5 bg-black rounded-full" />
        )}
      </>
    )

    const className = `w-full flex items-center justify-center lg:justify-start gap-3
      px-3 py-2.5 rounded-xl transition-all duration-200 group relative
       ${isActive
        ? 'bg-neon text-black font-semibold shadow-[0_0_14px_rgba(0,255,65,0.25)]'
        : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
      }`

    const handleClick = (e: React.MouseEvent) => {
      if (item.label === 'Feed') {
        e.preventDefault()
        setShowFeedPrompt(true)
        return
      }

      if (item.label === 'More') {
        e.preventDefault()
        setShowMoreMenu((prev) => !prev)
        return
      }
    }

    if (item.href) {
      if (item.label === 'Feed' || item.label === 'More') {
        return (
          <button onClick={handleClick} className={className}>
            {content}
          </button>
        )
      }

      return (
        <Link href={item.href} className={className}>
          {content}
        </Link>
      )
    }

    return (
      <button className={className}>
        {content}
      </button>
    )
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen
          w-20 lg:w-[220px]
          bg-[#121212]
          border-r border-white/[0.08]
          flex flex-col
          py-5 px-3
          z-30
          transition-transform duration-300
          ${isOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Logo */}
        <div className="hidden lg:flex items-center px-4 mb-10">
          <h1 className="text-[24px] font-black tracking-tight text-neon">
            Matiks
          </h1>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center mb-8">
          <div className="w-10 h-10 rounded-full bg-neon flex items-center justify-center text-black font-bold">
            M
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {topItems.map((item) => (
            <NavItemComponent key={item.label} item={item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <nav className="flex flex-col gap-1.5">
          {bottomItems.map((item) => (
            <NavItemComponent key={item.label} item={item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Feed Prompt */}
      {showFeedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowFeedPrompt(false)}
          />

          <div className="relative w-11/12 max-w-md p-5 rounded-2xl bg-[#121212] border border-white/10">
            <h3 className="text-lg font-bold mb-2">
              Start your feed system
            </h3>

            <p className="text-sm text-gray-400 mb-5">
              Would you like to start the feed system now?
            </p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowFeedPrompt(false)}
                className="px-4 py-2 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  try {
                    localStorage.setItem('matiks-feed-started', '1')
                  } catch { }

                  setShowFeedPrompt(false)
                  router.push('/feed')
                }}
                className="px-4 py-2 rounded-lg bg-neon text-black text-sm font-semibold hover:bg-neon/80"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Menu */}
      {showMoreMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMoreMenu(false)}
          />

          <div className="fixed bottom-5 left-[228px] w-56 p-2 rounded-xl bg-[#121212] border border-white/10 shadow-2xl z-50">
            <div className="flex flex-col gap-1">
              {[
                {
                  label: 'Friends',
                  icon: <Users size={15} />,
                  href: '/more',
                },
                {
                  label: 'Messages',
                  icon: <MessageSquare size={15} />,
                  href: '/more',
                },
                {
                  label: 'Leaderboard',
                  icon: <Trophy size={15} />,
                  href: '/more',
                },
                {
                  label: 'Nets',
                  icon: <Club size={15} />,
                  href: '/more',
                },
                {
                  label: 'Watch Matiks',
                  icon: <Gamepad2 size={15} />,
                  href: '/more',
                },
                {
                  label: 'Settings',
                  icon: <Settings size={15} />,
                  href: '/more',
                },
              ].map((subItem) => (
                <Link
                  key={subItem.label}
                  href={subItem.href}
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <span className="text-neon/80">
                    {subItem.icon}
                  </span>

                  <span>{subItem.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}