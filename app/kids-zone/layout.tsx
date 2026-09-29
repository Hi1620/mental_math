'use client'

import React from 'react'
import { AdventureProvider } from '@/lib/kids-zone-context'

export default function KidsZoneLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdventureProvider>{children}</AdventureProvider>
}
