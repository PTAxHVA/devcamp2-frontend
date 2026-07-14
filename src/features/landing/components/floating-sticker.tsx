import {
  SiPython,
  SiReact,
  SiCplusplus,
  SiJavascript,
  SiTypescript,
  SiDocker,
  SiGit,
  SiHtml5,
  SiNodedotjs,
  SiTailwindcss,
  SiGo,
  SiRust,
} from 'react-icons/si'
import { LuGlobe, LuTerminal } from 'react-icons/lu'

// Dùng class chuẩn Tailwind (vd: text-6xl, text-blue-500, opacity-20)
// thay vì viết gộp để đảm bảo mọi phiên bản Tailwind đều biên dịch được.
const stickersConfig = [
  {
    id: 1,
    Icon: SiPython,
    top: '5%',
    left: '4%',
    style: 'text-6xl text-blue-500 opacity-20',
    anim: 'animate-float',
  },
  {
    id: 2,
    Icon: SiReact,
    top: '10%',
    right: '6%',
    style: 'text-8xl text-cyan-500 opacity-20',
    anim: 'animate-float-delayed',
  },
  {
    id: 3,
    Icon: SiCplusplus,
    top: '15%',
    left: '8%',
    style: 'text-7xl text-indigo-500 opacity-20',
    anim: 'animate-float-slow',
  },

  {
    id: 4,
    Icon: LuGlobe,
    top: '22%',
    right: '5%',
    style: 'text-6xl text-emerald-500 opacity-20',
    anim: 'animate-float',
  },
  {
    id: 5,
    Icon: SiJavascript,
    top: '28%',
    left: '5%',
    style: 'text-6xl text-yellow-500 opacity-20',
    anim: 'animate-float-delayed',
  },
  {
    id: 6,
    Icon: SiDocker,
    top: '35%',
    right: '8%',
    style: 'text-7xl text-blue-600 opacity-15',
    anim: 'animate-float-slow',
  },

  {
    id: 7,
    Icon: SiGit,
    top: '42%',
    left: '7%',
    style: 'text-7xl text-orange-500 opacity-20',
    anim: 'animate-float',
  },
  {
    id: 8,
    Icon: SiTypescript,
    top: '48%',
    right: '5%',
    style: 'text-6xl text-blue-600 opacity-20',
    anim: 'animate-float-delayed',
  },
  {
    id: 9,
    Icon: LuTerminal,
    top: '55%',
    left: '4%',
    style: 'text-7xl text-slate-500 opacity-20',
    anim: 'animate-float-slow',
  },

  {
    id: 10,
    Icon: SiHtml5,
    top: '62%',
    right: '9%',
    style: 'text-6xl text-orange-600 opacity-20',
    anim: 'animate-float',
  },
  {
    id: 12,
    Icon: SiNodedotjs,
    top: '75%',
    right: '4%',
    style: 'text-8xl text-green-600 opacity-15',
    anim: 'animate-float-slow',
  },

  {
    id: 13,
    Icon: SiTailwindcss,
    top: '82%',
    left: '8%',
    style: 'text-6xl text-cyan-400 opacity-20',
    anim: 'animate-float',
  },
  {
    id: 14,
    Icon: SiGo,
    top: '88%',
    right: '7%',
    style: 'text-7xl text-cyan-600 opacity-20',
    anim: 'animate-float-delayed',
  },
  {
    id: 15,
    Icon: SiRust,
    top: '92%',
    left: '5%',
    style: 'text-5xl text-orange-800 opacity-15',
    anim: 'animate-float-slow',
  },
]

export const FloatingStickers = ({ reducedMotion }: { reducedMotion: boolean }) => {
  return (
    // Decorative tech-logo layer: purely visual, so it is aria-hidden and pointer-events-none
    // (never intercepts clicks). Hidden below md to avoid clutter/overflow on phones. Sits at
    // z-40 — above page content but below the sticky navbar (z-50). Each icon's float animation
    // is dropped under reduced motion.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-40 hidden overflow-hidden md:block"
    >
      {stickersConfig.map(({ id, Icon, top, left, right, style, anim }) => (
        <div
          key={id}
          className={`absolute flex items-center justify-center ${style} ${reducedMotion ? '' : anim}`}
          style={{
            top,
            left,
            right,
            filter: 'blur(1.5px)',
          }}
        >
          <Icon />
        </div>
      ))}
    </div>
  )
}
