'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export interface Pet {
  id: string
  name: string
  type: 'dragon' | 'unicorn' | 'phoenix' | 'griffin' | 'kitsune'
  level: number
  experience: number
  happiness: number
  hunger: number
}

export interface World {
  id: string
  name: string
  icon: string
  colorScheme: string
  unlocked: boolean
  progress: number
  completed: boolean
  buildings: BuildingProgress[]
}

export interface BuildingProgress {
  id: string
  name: string
  icon: string
  progress: number
  completed: boolean
  materialsNeeded: number
  materialsCollected: number
}

export interface DailyMission {
  id: string
  title: string
  description: string
  rewards: number
  completed: boolean
  progress: number
  maxProgress: number
}

export interface AdventureState {
  currentWorld: string
  pet: Pet
  worlds: World[]
  coins: number
  gems: number
  totalStars: number
  dailyMissions: DailyMission[]
  streak: number
  stickersCollected: string[]
  buildings: { [key: string]: BuildingProgress[] }
}

interface AdventureContextType {
  state: AdventureState
  updatePet: (updates: Partial<Pet>) => void
  unlockWorld: (worldId: string) => void
  completeWorld: (worldId: string) => void
  addCoins: (amount: number) => void
  addGems: (amount: number) => void
  addSticker: (stickerId: string) => void
  completeMission: (missionId: string) => void
  updateMissionProgress: (missionId: string, progress: number) => void
  playGame: (gameType: string) => void
  completeGame: (gameType: string, score: number, worldId: string) => void
  updateBuilding: (worldId: string, buildingId: string, progress: number) => void
  incrementStreak: () => void
  addStars: (amount: number) => void
}

const AdventureContext = createContext<AdventureContextType | undefined>(undefined)
const ADVENTURE_STORAGE_KEY = 'matiks-kids-zone-adventure'

const DEFAULT_WORLDS: World[] = [
  {
    id: 'forest',
    name: 'Enchanted Forest',
    icon: '🌲',
    colorScheme: 'from-green-300 to-emerald-400',
    unlocked: true,
    progress: 0,
    completed: false,
    buildings: [],
  },
  {
    id: 'mountains',
    name: 'Crystal Mountains',
    icon: '🏔️',
    colorScheme: 'from-blue-300 to-indigo-400',
    unlocked: false,
    progress: 0,
    completed: false,
    buildings: [],
  },
  {
    id: 'ocean',
    name: 'Mystical Ocean',
    icon: '🌊',
    colorScheme: 'from-cyan-300 to-blue-400',
    unlocked: false,
    progress: 0,
    completed: false,
    buildings: [],
  },
  {
    id: 'volcano',
    name: 'Dragon Volcano',
    icon: '🌋',
    colorScheme: 'from-orange-300 to-red-400',
    unlocked: false,
    progress: 0,
    completed: false,
    buildings: [],
  },
]

const DEFAULT_PET: Pet = {
  id: '1',
  name: 'Blaze',
  type: 'dragon',
  level: 5,
  experience: 1250,
  happiness: 85,
  hunger: 30,
}

export function AdventureProvider({ children }: { children: ReactNode }) {
  const [isStateLoaded, setIsStateLoaded] = useState(false)
  const [state, setState] = useState<AdventureState>({
    currentWorld: 'forest',
    pet: DEFAULT_PET,
    worlds: DEFAULT_WORLDS,
    coins: 500,
    gems: 25,
    totalStars: 1250,
    dailyMissions: [
      { id: '1', title: 'Play 2 Games', description: 'Complete 2 learning games', rewards: 50, completed: false, progress: 1, maxProgress: 2 },
      { id: '2', title: 'Feed Pet', description: 'Feed your pet 3 times', rewards: 30, completed: false, progress: 0, maxProgress: 3 },
      { id: '3', title: 'Collect Stickers', description: 'Find 5 stickers today', rewards: 75, completed: false, progress: 2, maxProgress: 5 },
    ],
    streak: 7,
    stickersCollected: ['s1', 's2', 's3', 's5', 's8'],
    buildings: {},
  })

  useEffect(() => {
    try {
      const storedState = window.localStorage.getItem(ADVENTURE_STORAGE_KEY)
      if (storedState) {
        const parsedState = JSON.parse(storedState) as AdventureState
        if (
          Array.isArray(parsedState.worlds) &&
          parsedState.pet &&
          Array.isArray(parsedState.dailyMissions)
        ) {
          setState(parsedState)
        }
      }
    } catch (error) {
      console.error('Unable to load Kids Zone progress.', error)
    } finally {
      setIsStateLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!isStateLoaded) return

    try {
      window.localStorage.setItem(ADVENTURE_STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Unable to save Kids Zone progress.', error)
    }
  }, [isStateLoaded, state])

  const updatePet = (updates: Partial<Pet>) => {
    setState((prev) => ({
      ...prev,
      pet: { ...prev.pet, ...updates },
    }))
  }

  const unlockWorld = (worldId: string) => {
    setState((prev) => ({
      ...prev,
      worlds: prev.worlds.map((w) => (w.id === worldId ? { ...w, unlocked: true } : w)),
    }))
  }

  const completeWorld = (worldId: string) => {
    setState((prev) => ({
      ...prev,
      worlds: prev.worlds.map((w) => (w.id === worldId ? { ...w, completed: true, progress: 100 } : w)),
      totalStars: prev.totalStars + 200,
    }))
  }

  const addCoins = (amount: number) => {
    setState((prev) => ({ ...prev, coins: prev.coins + amount }))
  }

  const addGems = (amount: number) => {
    setState((prev) => ({ ...prev, gems: prev.gems + amount }))
  }

  const addSticker = (stickerId: string) => {
    setState((prev) => ({
      ...prev,
      stickersCollected: prev.stickersCollected.includes(stickerId) ? prev.stickersCollected : [...prev.stickersCollected, stickerId],
    }))
  }

  const completeMission = (missionId: string) => {
    setState((prev) => {
      const mission = prev.dailyMissions.find((m) => m.id === missionId)
      const rewards = mission?.rewards || 50
      return {
        ...prev,
        dailyMissions: prev.dailyMissions.map((m) => (m.id === missionId ? { ...m, completed: true } : m)),
        coins: prev.coins + rewards,
        totalStars: prev.totalStars + rewards,
      }
    })
  }

  const updateMissionProgress = (missionId: string, progress: number) => {
    setState((prev) => {
      const updatedMissions = prev.dailyMissions.map((m) => {
        if (m.id === missionId) {
          const newProgress = Math.min(progress, m.maxProgress)
          const isCompleted = newProgress >= m.maxProgress
          return { ...m, progress: newProgress, completed: isCompleted }
        }
        return m
      })

      const mission = updatedMissions.find((m) => m.id === missionId)
      const wasJustCompleted = mission?.completed && !prev.dailyMissions.find((m) => m.id === missionId)?.completed

      return {
        ...prev,
        dailyMissions: updatedMissions,
        coins: wasJustCompleted ? prev.coins + (mission?.rewards || 0) : prev.coins,
        totalStars: wasJustCompleted ? prev.totalStars + (mission?.rewards || 0) : prev.totalStars,
      }
    })
  }

  const playGame = (gameType: string) => {
    const gameMission = state.dailyMissions.find((m) => m.id === '1')
    if (gameMission && !gameMission.completed) {
      updateMissionProgress('1', gameMission.progress + 1)
    }
  }

  const completeGame = (gameType: string, score: number, worldId: string) => {
    setState((prev) => {
      const rewards = Math.floor(score / 10) || 10
      const worldIndex = prev.worlds.findIndex((world) => world.id === worldId)
      const currentWorld = prev.worlds[worldIndex]
      const progress = currentWorld
        ? Math.min(100, currentWorld.progress + 34)
        : 0
      const completed = currentWorld ? progress >= 100 : false
      const worlds = prev.worlds.map((world, index) => {
        if (index === worldIndex) {
          return { ...world, progress, completed }
        }

        if (completed && index === worldIndex + 1) {
          return { ...world, unlocked: true }
        }

        return world
      })

      return {
        ...prev,
        worlds,
        coins: prev.coins + rewards,
        totalStars: prev.totalStars + rewards,
      }
    })
  }

  const updateBuilding = (worldId: string, buildingId: string, progress: number) => {
    setState((prev) => ({
      ...prev,
      buildings: {
        ...prev.buildings,
        [worldId]: (prev.buildings[worldId] || []).map((b) => (b.id === buildingId ? { ...b, progress } : b)),
      },
    }))
  }

  const incrementStreak = () => {
    setState((prev) => ({ ...prev, streak: prev.streak + 1 }))
  }

  const addStars = (amount: number) => {
    setState((prev) => ({ ...prev, totalStars: prev.totalStars + amount }))
  }

  return (
    <AdventureContext.Provider
      value={{
        state,
        updatePet,
        unlockWorld,
        completeWorld,
        addCoins,
        addGems,
        addSticker,
        completeMission,
        updateMissionProgress,
        playGame,
        completeGame,
        updateBuilding,
        incrementStreak,
        addStars,
      }}
    >
      {children}
    </AdventureContext.Provider>
  )
}

export function useAdventure() {
  const context = useContext(AdventureContext)
  if (!context) {
    throw new Error('useAdventure must be used within AdventureProvider')
  }
  return context
}
