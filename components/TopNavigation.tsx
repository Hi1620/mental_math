'use client'

import {
  Bell,
  MessageCircle,
  Settings,
  Zap,
  Coins,
  Flame,
  Users,
} from 'lucide-react'

export function TopNavigation() {
  return (
    <header
      className="
        fixed top-0
        left-20 lg:left-[220px]
        right-0
        h-16
        bg-[#121212]/90
        backdrop-blur-md
        border-b border-white/[0.08]
        flex items-center justify-between
        px-4 lg:px-6
        z-20
      "
    >
      {/* User + Stats */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="
            w-9 h-9
            rounded-full
            bg-gradient-to-br from-neon to-neon-dark
            flex items-center justify-center
            text-black
            font-bold
            text-sm
            cursor-pointer
          "
        >
          U
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-2">
          {/* XP */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <Zap size={14} className="text-neon" />
            <span className="text-[12px] font-semibold">
              12,450 XP
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <Coins size={14} className="text-yellow-400" />
            <span className="text-[12px] font-semibold">
              8,320
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <Flame size={14} className="text-orange-400" />
            <span className="text-[12px] font-semibold">
              42 Days
            </span>
          </div>
        </div>
      </div>

      {/* Online Friends */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-[11px] text-gray-500">
          Online
        </span>

        <div className="flex items-center -space-x-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="
                w-8 h-8
                rounded-full
                bg-gradient-to-br
                from-neon/50 to-neon/20
                border-2 border-[#121212]
                flex items-center justify-center
                text-[10px]
                font-semibold
              "
            >
              F{i}
            </div>
          ))}

          <button
            className="
              w-8 h-8
              rounded-full
              bg-white/5
              border border-white/10
              flex items-center justify-center
              text-gray-400
              ml-1
            "
          >
            <Users size={14} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg hover:bg-white/5 transition-all relative">
          <Bell size={18} className="text-gray-400" />

          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <button className="p-2 rounded-lg hover:bg-white/5 transition-all">
          <MessageCircle size={18} className="text-gray-400" />
        </button>

        <button className="p-2 rounded-lg hover:bg-white/5 transition-all">
          <Settings size={18} className="text-gray-400" />
        </button>
      </div>
    </header>
  )
}