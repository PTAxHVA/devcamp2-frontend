import type { IconType } from 'react-icons'
import {
  RiHome6Line,
  RiMapPinLine,
  RiBookOpenLine,
  RiPassportLine,
  RiSettings4Line,
  RiUser3Line,
  RiQuestionLine,
} from 'react-icons/ri'
import { TbTargetArrow } from 'react-icons/tb'

export interface PageMeta {
  title: string
  Icon: IconType | null
}

// Ordered most-specific first; the first keyword that the path contains wins.
// Mirrors the sidebar's substring matching so the header title and the active
// nav item always agree.
const ROUTES: { keywords: string[]; title: string; Icon: IconType }[] = [
  { keywords: ['/support'], title: 'Help & Support', Icon: RiQuestionLine },
  { keywords: ['/passport'], title: 'Passport', Icon: RiPassportLine },
  { keywords: ['/setting'], title: 'Settings', Icon: RiSettings4Line },
  { keywords: ['/profile'], title: 'Profile', Icon: RiUser3Line },
  { keywords: ['/goal'], title: 'Career goals', Icon: TbTargetArrow },
  { keywords: ['/my-learning', '/topic', '/section'], title: 'My Learning', Icon: RiBookOpenLine },
  { keywords: ['/roadmap'], title: 'Roadmaps', Icon: RiMapPinLine },
  { keywords: ['/dashboard'], title: 'Dashboard', Icon: RiHome6Line },
]

/**
 * Resolve the topbar's page title + icon from the current path. Unknown routes
 * return an empty title so the topbar can fall back to the greeting alone.
 */
export const getPageMeta = (pathname: string): PageMeta => {
  const path = pathname.toLowerCase()
  const match = ROUTES.find((route) => route.keywords.some((keyword) => path.includes(keyword)))
  return match ? { title: match.title, Icon: match.Icon } : { title: '', Icon: null }
}
