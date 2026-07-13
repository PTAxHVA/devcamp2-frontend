import { createContext, useContext } from 'react'

export interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  effectiveCollapsed: boolean
}

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  effectiveCollapsed: false,
})

export const useSidebar = () => useContext(SidebarContext)
