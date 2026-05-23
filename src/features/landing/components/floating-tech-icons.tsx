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
    <div className="absolute inset-0 pointer-events-none z-0">
      <FaReact className="absolute top-[15%] left-[35%] text-[#61DAFB] w-12 h-12 opacity-50 animate-float hidden md:block" />
      <FaHtml5 className="absolute top-[40%] left-[45%] text-[#E34F26] w-16 h-16 opacity-20 animate-float-delayed" />
      <FaCss3Alt className="absolute bottom-20 left-[5%] text-[#1572B6] w-14 h-14 opacity-20 animate-float-slow hidden lg:block" />
      <FaNodeJs className="absolute bottom-[10%] left-[30%] text-[#339933] w-10 h-10 opacity-20 animate-float-delayed hidden md:block" />
      <FaPython className="absolute bottom-10 right-[40%] text-[#3776AB] w-12 h-12 opacity-20 animate-float hidden lg:block" />
      <FaCode className="absolute rotate-30 top-30 right-[80%] text-[#3776AB] w-12 h-12 opacity-15 animate-float hidden lg:block" />
      <FaAngular className="absolute rotate-2 bottom-[-10%] right-[80%] text-[#E34F26] w-12 h-12 opacity-15 animate-float hidden lg:block" />
      <BiLogoPostgresql className="absolute rotate-2 bottom-[-10%] left-[80%] text-blue-700 w-12 h-12 opacity-30 animate-float hidden lg:block" />
      <FaRust className="absolute rotate-2 bottom-[20%] left-[80%] text-blue-300 w-12 h-12 opacity-30 animate-float hidden lg:block" />
      <TbBrandAmongUs className="absolute rotate-2 bottom-[29%] right-[10%] text-red-400 w-12 h-12 opacity-30 animate-float hidden lg:block" />
    </div>
  )
}
export default FloatingTechIcons
