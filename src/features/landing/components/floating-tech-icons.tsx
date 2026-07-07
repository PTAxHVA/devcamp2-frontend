import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaAngular,
  FaCode,
  FaRust,
} from 'react-icons/fa'
import { BiLogoPostgresql } from 'react-icons/bi'
import { TbBrandAmongUs } from 'react-icons/tb'
const FloatingTechIcons = () => {
  return (
    // overflow-hidden: this layer is anchored to the (viewport-sized) initial
    // containing block — no positioned ancestor — so the bottom-[-10%] icons used
    // to poke below the document and add a dead scroll strip under the footer on
    // 2K/4K screens (NEW-3: 139px @2560, 211px @3840).
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <FaReact className="animate-float absolute top-[15%] left-[35%] hidden h-12 w-12 text-[#61DAFB] opacity-50 md:block" />
      <FaHtml5 className="animate-float-delayed absolute top-[40%] left-[45%] h-16 w-16 text-[#E34F26] opacity-20" />
      <FaCss3Alt className="animate-float-slow absolute bottom-20 left-[5%] hidden h-14 w-14 text-[#1572B6] opacity-20 lg:block" />
      <FaNodeJs className="animate-float-delayed absolute bottom-[10%] left-[30%] hidden h-10 w-10 text-[#339933] opacity-20 md:block" />
      <FaPython className="animate-float absolute right-[40%] bottom-10 hidden h-12 w-12 text-[#3776AB] opacity-20 lg:block" />
      <FaCode className="animate-float absolute top-30 right-[80%] hidden h-12 w-12 rotate-30 text-[#3776AB] opacity-15 lg:block" />
      <FaAngular className="animate-float absolute right-[80%] bottom-[-10%] hidden h-12 w-12 rotate-2 text-[#E34F26] opacity-15 lg:block" />
      <BiLogoPostgresql className="animate-float absolute bottom-[-10%] left-[80%] hidden h-12 w-12 rotate-2 text-blue-700 opacity-30 lg:block" />
      <FaRust className="animate-float absolute bottom-[20%] left-[80%] hidden h-12 w-12 rotate-2 text-blue-300 opacity-30 lg:block" />
      <TbBrandAmongUs className="animate-float absolute right-[10%] bottom-[29%] hidden h-12 w-12 rotate-2 text-red-400 opacity-30 lg:block" />
    </div>
  )
}
export default FloatingTechIcons
